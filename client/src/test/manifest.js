// components added to the manifest can be accessed in browser via /test/{componentName}

export default {
  MainMenu: {
    component: require('../components/Navigations/MainMenu'),
    props: {
    }
  },
  Button: {
    components: require('../components/Button/Button'),
    props: {
    }
  },
  RichTextEditor: {
    components: require('../components/RichTextEditor/RichTextEditor'),
    props: {}
  },
  ReplyOnReply: {
    components: require('../components/ReplyOnReply/ReplyOnReply'),
    props: {
      author: 'author',
      content: 'content'
    }
  }
};
