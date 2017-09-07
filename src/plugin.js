import Uploader from './uploader';

const plugin = (editor) => {
  editor.addButton('upload', {
    tooltip: 'Insert file',
    icon: 'upload',

    onclick: () => {
      let window = editor.windowManager.open({
        height: 112,
        width: 460,
        title: 'Upload',

        buttons: [{
          text: 'Cancel',
          onclick: () => {
            window.close();
          }
        }],

        html: '<div class="editor-upload"> <label class="control-label">File</label> <input type="text" name="selected-file" class="text_file"> <span class="btn btn-default btn-file btn-visible-input"> <input type="file" name="file" data-id="input-upload"> Select file </span> <div class="progress progress-striped active"> <div class="progress-bar" role="progressbar"></div> </div> </div>'
      });

      let element, failure, success, text, buildHtml;
      element = $('.editor-upload');
      text = $('input[name=selected-file]');

      buildHtml = (filename, url) => {
        if (/\.(gif|jpg|jpeg|png)$/i.test(filename)) {
          return `<img src='${url}' alt='${filename}'>`;
        } else {
          return `<a href='${url}'>${filename}</a>`;
        }
      };

      success = (file, url) => {
        let html = buildHtml(file, url);
        editor.insertContent(html + '&nbsp;');
        window.close();
      };

      failure = () => {
        console.error('Upload failed');
      };

      element.find('input[type=file]').change(event => {
        let target = $(event.target),
          filename = target.val().split('\\').pop();
        return text.val(filename);
      });

      new Uploader().upload(element, success, failure);
    }
  });
};

export default plugin;
