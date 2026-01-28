// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: 'http://localhost:3000/api',
  mediaUrl: 'http://localhost:3000/api/uploads/',
  soketServer : 'http://localhost:3000',
  //remoto vercel
  // baseUrl: 'https://back-delivery-nodejs.vercel.app/api',
  // mediaUrl: 'https://back-delivery-nodejs.vercel.app/api/uploads/',
  // soketServer : 'https://back-delivery-nodejs.vercel.app/',

  mediaUrlRemoto: 'https://res.cloudinary.com/dmv6aukai/image/upload/v1741218430/enviosapp',
  
  //pluggins
  rapidapiKey: '****',
  rapidapiHost: '****',
  clientIdPaypal: '****',
  sandboxPaypal: '****',
  client_idGoogle: '****'
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
