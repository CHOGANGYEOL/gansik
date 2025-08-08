declare namespace NodeJS {
  interface ProcessEnv {
    readonly GOOGLE_SHEET_ID: string;
    readonly GOOGLE_PRIVATE_KEY: string;
    readonly GOOGLE_CLIENT_EMAIL: string;
    readonly TRUSTED_IPS: string;
    readonly WHITE_LIST_IPS: string;
  }
}
