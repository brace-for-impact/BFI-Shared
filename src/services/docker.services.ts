import Docker from "dockerode";

export const getContainerServices = async (args: {
    networkName: string,
    docker: Docker
}) => {
    try {
        const {
            docker,
            networkName
        } = args
        // Get all containers with a filter for the specific network
        const containers = await docker.listContainers({
            all: true,
            filters: {
                network: [networkName],
            },
        });

        const services = {};

        for (const container of containers) {
            const name = container.Names[0].replace(/^\//, "");
            const status = container.State;
            const created = container.Created;
            const id = container.Id;
            const image = container.Image;
            const ports = container.Ports;

            // Calculate how long the container has been running
            const runningSince = new Date().getTime() / 1000 - created;

            // Category based on known patterns in the container name
            let category = "misc";
            if (name.includes("traefik")) category = "traefik";
            else if (name.includes("gateway")) category = "gateway";
            else if (name.includes("auth")) category = "auth";
            else if (name.includes("logs")) category = "logs";
            else if (name.includes("mongo")) category = "mongo";
            else if (name.includes("zookeeper")) category = "zookeeper";
            else if (name.includes("kafka")) category = "kafka";
            else if (name.includes("kafdrop")) category = "kafdrop";

            // Sub-group by service name, fallback to image
            const service_name =
                container.Labels["com.docker.compose.service"] || image;

            // Initialize category if not present
            if (!services[category]) {
                services[category] = {};
            }

            // Initialize service array
            if (!services[category][service_name]) {
                services[category][service_name] = [];
            }

            // Add essential information for frontend display
            services[category][service_name].push({
                id,
                name,
                status,
                runningSince: Math.floor(runningSince), // converting to seconds
                image,
            });
        }

        return services;
    } catch (error) {
        console.error("Error fetching container services:", error);
        throw error;
    }
};
