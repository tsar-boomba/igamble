import { RouteHandler } from 'next-route-handler';

export default new RouteHandler().get((req, res) => {
	res.setHeader(
		'set-cookie',
		`access_token=; Secure; HttpOnly; Path=/; Expires=${new Date(
			Date.now() - 1000000,
		).toUTCString()}`,
	);
	return res.status(200).json({ message: 'Logged out.' });
});
