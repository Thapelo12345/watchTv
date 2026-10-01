import * as ReactTestRenderer from "react-test-renderer";

export function createRoot() {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  return {
    render(element: React.ReactElement) {
      if (renderer) {
        renderer.update(element);
      } else {
        renderer = ReactTestRenderer.create(element);
      }
    },
    unmount() {
      renderer?.unmount();
    },
    get container() {
      if (!renderer) {
        throw new Error("The renderer has not been initialized.");
      }
      return renderer.root;
    },
  };
}
