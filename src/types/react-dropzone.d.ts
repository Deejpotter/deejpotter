// Minimal ambient module declaration to silence missing types for `react-dropzone` during build.
// Replace with official @types/react-dropzone or proper typing when upgrading dependencies.
declare module "react-dropzone" {
  import { HTMLAttributes } from 'react';
  export function useDropzone(options?: any): {
    getRootProps: (props?: HTMLAttributes<HTMLElement>) => any;
    getInputProps: (props?: any) => any;
    open: () => void;
    acceptedFiles?: File[];
  };
  export default useDropzone;
}
