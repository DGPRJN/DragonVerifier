import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_BACKEND_LOCAL}/api/v1/:path*`,
            },
        ];
    },
};

export default nextConfig;