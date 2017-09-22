import settings from './config';

export default class {
  constructor() {
    this.filenames = {};
    this.settings = settings;
  }

  upload(element, success, failure) {
    this.loadCredentials(element, success, failure);
  }

  loadCredentials(element, successCallback, failureCallback) {
    let self = this;

    $.ajax({
      url: settings.uploadsEndpoint,
      type: 'GET',
      dataType: 'json',
      headers: settings.headers,
      complete: (response) => {
        self.credentials = response.responseJSON;
        self.processUpload(element, successCallback, failureCallback);
      }
    });
  }

  getParam(name, options) {
    return settings[this.credentials.type][name](this.credentials, options);
  }

  pathFor(name) {
    return `${this.credentials.base}${name}`;
  }

  experiment() {
    return $('[data-experiment]').attr('data-experiment');
  }

  filename(file) {
    return this.filenames[`${file.name}-${file.size}`];
  }

  processUpload(element, success, failure) {
    let uploader = this;

    element.find('[data-id=input-upload]').fileupload({
      url: uploader.getParam('url'),
      type: 'POST',
      autoUpload: true,
      headers: settings.headers,

      formData: () => {
        let file = uploader.files[0];
        let extension = file.name.split('.').pop();
        let filename = `${new Date().getTime()}${Math.floor(Math.random() * 10001)}.${extension}`;

        uploader.filenames[`${file.name}-${file.size}`] = filename;

        let formData = uploader.getParam('formData');
        formData.push({ name: 'Content-Type', value: file.type });
        formData.push({ name: 'key', value: uploader.pathFor(filename) });

        return formData;
      },

      add: (event, data) => {
        uploader.files = data.files;
        if (data.files[0].size <= settings.uploadMaxSize) {
          data.submit();
        }
      },

      done: (event, data) => {
        let file = data.files[0];
        let id = uploader.filename(file);

        $.ajax({
          url: `${settings.uploadsEndpoint}/${id}`,
          dataType: 'json',
          method: 'PATCH',
          headers: settings.headers,

          data: {
            experiment_id: uploader.experiment(),
            key: `tmp/${id}`
          },

          complete: (response) => {
            let bar = element.find('.progress-bar');
            bar.attr('style', 'width: 100%');
            bar.addClass('progress-bar-success');
            success(file.name, response.responseJSON.url);
          }
        });
      },

      fail: () => {
        element.find('.progress-bar').addClass('progress-bar-danger');
        failure();
      },

      progress: (event, data) => {
        let file = data.files[0];
        let percentage = data.loaded / file.size * 100;
        let progress = element.find('.progress');
        let bar = progress.find('.progress-bar');

        progress.attr('style', '');
        bar.removeClass('progress-bar-danger');
        bar.attr('style', `width: ${percentage}%`);
      }
    });
  }
}
