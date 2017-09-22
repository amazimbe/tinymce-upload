const JSON_FORMAT = 'application/vnd.hivebench-v4+json';
const UPLOADS_ENDPOINT = '/api/uploads';

export default {
  uploadsEndpoint: UPLOADS_ENDPOINT,

  // 20MB limit
  uploadMaxSize: 20971520,

  headers: (() => {
    let testSession = {
      authenticated: {
        authenticator: "authenticator:devise-auth-token",
        accessToken: "_epWUd-ThFxFJhJbxKiKqQ",
        expiry: "1504778749",
        tokenType: "Bearer",
        uid: "alzie@gmail.com",
        client: "ge2AMWWQeP299lWwj6VACg",
        id: 1
      }
    };

    let session = window.localStorage.getItem('ember_simple_auth-session');
    let authHeaders = (JSON.parse(session) || testSession).authenticated;

    return {
      'access-token': authHeaders.accessToken,
      client: authHeaders.client,
      id: authHeaders.id,
      uid: authHeaders.uid,
      accept: JSON_FORMAT
    };
  })(),

  local: {
    crossDomain: false,
    url: () => {
      return UPLOADS_ENDPOINT;
    },
    base: (credentials) => {
      return `/${credentials.base}`;
    },
    formData: () => {
      return [];
    }
  },

  aws: {
    crossDomain: true,
    url: (credentials) => {
      return `//${credentials.bucket}.s3.amazonaws.com/`;
    },
    base: (credentials) => {
      return `//${credentials.bucket}.s3.amazonaws.com/${credentials.base}`;
    },
    formData: (credentials) => {
      return [{
        name: 'acl',
        value: 'public-read'
      }, {
        name: 'AWSAccessKeyId',
        value: credentials.accesskeyid
      }, {
        name: 'policy',
        value: credentials.policy
      }, {
        name: 'signature',
        value: credentials.signature
      }, {
        name: 'success_action_status',
        value: '201'
      }, {
        name: 'Filename',
        value: '${Filename}'
      }];
    }
  }
};
