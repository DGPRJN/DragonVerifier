const nextConfig = {
    // async rewrites() {
    //     const isProd = process.env.NODE_ENV === "production";
    //     const backendUrl = isProd
    //         ? process.env.NEXT_PUBLIC_BACKEND_URL
    //         : process.env.NEXT_PUBLIC_BACKEND_LOCAL;

    //     return [
    //         {
    //             source: "/api/:path*",
    //             destination: `${backendUrl}/api/v1/:path*`,
    //         },
    //     ];
    // },

};

export default nextConfig;


