import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname:
                    "bc16f399-f374-4a1e-a578-8a4052cc8a91.selstorage.ru",
            },
        ],
    },
};

export default nextConfig;
