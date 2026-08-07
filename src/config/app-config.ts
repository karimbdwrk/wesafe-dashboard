import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "WeSafe Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, WeSafe App Admin.`,
  meta: {
    title: "WeSafe Admin",
    description: "Espace d'administration WeSafe, la plateforme de recrutement dédiée à la sécurité privée.",
  },
};
