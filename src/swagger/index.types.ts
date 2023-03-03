export interface SwaggerDocs300 {
  info: {
    version: string;
    title: string;
    description: string;
    termsOfService?: string;
    contact?: {
      name: string;
      email: string;
      url: string;
    };
    license?: {
      name: string;
      url: string;
    }
  },
  servers: Array<{url: string}>
}