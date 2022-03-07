const { withSuperjson } = require('next-superjson');

/** @type {import('next').NextConfig} */
module.exports = withSuperjson()({
	reactStrictMode: true,
	swcMinify: true,
});
