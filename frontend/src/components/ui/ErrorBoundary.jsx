import { Component } from "react";
import Container from "../layout/Container";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-2xl text-red-400" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Нещо се обърка
          </h1>
          <p className="mt-2 text-gray-600">
            Възникна неочаквана грешка. Моля, презаредете страницата.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            <i className="fas fa-rotate-right" aria-hidden="true" />
            Презареди
          </button>
        </Container>
      );
    }

    return this.props.children;
  }
}
