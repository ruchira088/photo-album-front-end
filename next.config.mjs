/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [{
            hostname: "*"
        }]
    }
}

export default nextConfig
