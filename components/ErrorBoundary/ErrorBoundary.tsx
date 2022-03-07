import React from 'react';

interface Props {
	children: React.ReactNode;
}

class ErrorBoundary extends React.Component<Props, { error?: Error }> {
	constructor(props: Props) {
		super(props);
		this.state = { error: undefined };
	}

	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		return { error };
	}

	componentDidCatch(error: Error, errorInfo: { componentStack: any }) {}

	render() {
		if (this.state.error) {
			// You can render any custom fallback UI
			return <h1>{this.state.error?.message}</h1>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
