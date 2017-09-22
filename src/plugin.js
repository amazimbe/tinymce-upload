import Uploader from './uploader';
import template from './template';

const plugin = (editor) => {
  editor.addButton('upload', {
    tooltip: 'Insert file',
    icon: 'upload',

    onclick() {
      let window = editor.windowManager.open({
        height: 112,
        width: 460,
        html: template,
        title: 'Upload',

        buttons: [{
          text: 'Cancel',
          onclick() {
            window.close();
          }
        }]
      });

      let element = $('.editor-upload');
      let text = $('input[name=selected-file]');

      let buildHtml = (filename, url) => {
        if (/\.(gif|jpg|jpeg|png)$/i.test(filename)) {
          return `<img src='${url}' alt='${filename}'>`;
        } else {
          return `<a href='${url}'>${filename}</a>`;
        }
      };

      let success = (file, url) => {
        let html = buildHtml(file, url);
        editor.insertContent(html + '&nbsp;');
        window.close();
      };

      let failure = () => {
        console.error('Upload failed');
      };

      element.find('input[type=file]').change(event => {
        let target = $(event.target);
        let filename = target.val().split('\\').pop();
        return text.val(filename);
      });

      new Uploader().upload(element, success, failure);
    }
  });
};

export default plugin;
