import { Component, ErrorInfo, ReactNode } from "react";

// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
// https://stackoverflow.com/a/78132377

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(err: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: err };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ margin: "0 auto" }}>
          <h2>Something went wrong</h2>
          <p>Error: {this.state.error?.toString()}</p>
          <p>See console for details</p>
        </div>
      );
    }

    return this.props.children;
  }
}
