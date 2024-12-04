import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    hidden?: boolean;
    title?: string;
    icon?: string;
    permission?: string;
    activePath?: string;
    noShowingChildren?: boolean;
  }
}
