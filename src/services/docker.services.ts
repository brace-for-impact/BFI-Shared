import Docker from "dockerode";
import fs from "fs";

const getContainerServices = (closureArgs: { docker: Docker }) => {
  return async (args: { networkName: string }) => {
    try {
      const { docker } = closureArgs;
      const { networkName } = args;

      const containers = await docker.listContainers({
        all: true,
        filters: {
          network: [networkName],
        },
      });

      const services: Record<string, Record<string, any[]>> = {};

      for (const container of containers) {
        const name = container.Names[0].replace(/^\//, "");
        const status = container.State;
        const created = container.Created;
        const id = container.Id;
        const image = container.Image;

        const runningSince = Date.now() / 1000 - created;

        let category = "misc";
        if (name.includes("traefik")) category = "traefik";
        else if (name.includes("gateway")) category = "gateway";
        else if (name.includes("auth")) category = "auth";
        else if (name.includes("logs")) category = "logs";
        else if (name.includes("mongo")) category = "mongo";
        else if (name.includes("zookeeper")) category = "zookeeper";
        else if (name.includes("kafka")) category = "kafka";
        else if (name.includes("kafdrop")) category = "kafdrop";

        const service_name =
          container.Labels["com.docker.compose.service"] || image;

        if (!services[category]) services[category] = {};
        if (!services[category][service_name]) services[category][service_name] = [];

        services[category][service_name].push({
          id,
          name,
          status,
          runningSince: Math.floor(runningSince),
          image,
        });
      }

      return services;
    } catch (error) {
      console.error("Error fetching container services:", error);
      throw error;
    }
  };
};

const getContainerInfo = ({ docker }: { docker: Docker }) => {
  return async () => {
    const shortId = fs.readFileSync("/etc/hostname", "utf8").trim();
    const containers = await docker.listContainers({ all: true });

    const container = containers.find((c) => c.Id.startsWith(shortId));
    if (!container) return null;

    const fullContainer = docker.getContainer(container.Id);
    const inspect = await fullContainer.inspect();

    return {
      id: inspect.Id,
      name: inspect.Name,
      image: inspect.Config.Image,
      state: inspect.State,
      created: inspect.Created,
      platform: inspect.Platform,
    };
  };
};

// ========= boot logic =========

export let services: {
  getContainerServices: ReturnType<typeof getContainerServices>;
  getContainerInfo: ReturnType<typeof getContainerInfo>;
} | null = null;

export const bootDockerServices = async () => {
  try {
    const docker = new Docker({ socketPath: "/var/run/docker.sock" });

    services = {
      getContainerServices: getContainerServices({ docker }),
      getContainerInfo: getContainerInfo({ docker }),
    };

    console.log("[Docker] Boot successful")
  } catch (error) {
    console.error("Failed to boot docker services:", error);
    services = null;
  }
};
