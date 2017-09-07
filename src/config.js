export default {
  uploadsEndpoint: '/api/uploads',

  // 20MB limit
  uploadMaxSize: 20971520,

  headers: (() => {
    let session, authHeaders;

    session = window.localStorage.getItem('ember_simple_auth-session');
    authHeaders = JSON.parse(session).authenticated;

    return {
      'access-token': authHeaders.accessToken,
      client: authHeaders.client,
      id: authHeaders.id,
      uid: authHeaders.uid,
      accept: 'application/vnd.hivebench-v4+json'
    };
  })(),

  local: {
    crossDomain: false,
    url: (credentials) => {
      return '/api/uploads';
    },
    base: (credentials) => {
      return `/${credentials.base}`;
    },
    formData: (credentials) => {
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
}
