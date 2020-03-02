import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Notification from 'react-web-notification'

class App extends Component{

  constructor(props) {
    super(props)
    this.state = {
      inputText: "",
      msg: "",
      ignore: true,
      title: ""
    }
    this.refIframe = React.createRef()
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  componentDidMount() {
    // 接受domain2返回数据
    window.addEventListener('message', this.getMessage , false);
    window.addEventListener('message', event=>{this.handleButtonClick(event)} , false);
  }

  componentWillUnmount() {
    window.removeEventListener('mesage', this.getMessage)
    window.removeEventListener('mesage', event=>{this.handleButtonClick(event)} )
  } 

  buttonClick = (e) => {
    var data = {           
       title: this.state.inputText
    };        
     // 向domain2传送跨域数据
    this.refIframe.current.contentWindow.postMessage(JSON.stringify(data),'http://localhost:8001');
    //window.parent.postMessage(JSON.stringify(data),'http://localhost:8001');
    console.log(this.refIframe.current.contentWindow)
  }

  getMessage = (e) => {
    let obj = JSON.parse(e.data)
    this.setState({
      msg: obj.title
    }, ()=> console.log(this.state.msg) )

    //this.buttonClick()
  }

  handlePermissionGranted(){
    console.log('Permission Granted');
    this.setState({
      ignore: false
    });
  }
  handlePermissionDenied(){
    console.log('Permission Denied');
    this.setState({
      ignore: true
    });
  }
  handleNotSupported(){
    console.log('Web Notification not Supported');
    this.setState({
      ignore: true
    });
  }
  handleNotificationOnClick(e, tag){
    console.log(e, 'Notification clicked tag:' + tag);
  }

  handleNotificationOnError(e, tag){
    console.log(e, 'Notification error tag:' + tag);
  }

  handleNotificationOnClose(e, tag){
    console.log(e, 'Notification closed tag:' + tag);
  }

  handleNotificationOnShow(e, tag){
    //this.playSound();
    console.log(e, 'Notification shown tag:' + tag);
  }

  // playSound(filename){
  //   document.getElementById('sound').play();
  // }
  handleButtonClick() {

    if(this.state.ignore) {
      return;
    }

    const now = Date.now();

    const title = 'React-Web-Notification ' + this.state.msg;
    const body = 'Hello' //+ new Date();
    const tag = now;
    const icon = 'http://mobilusoss.github.io/react-web-notification/example/Notifications_button_24.png';
    // const icon = 'http://localhost:3000/Notifications_button_24.png';

    // Available options
    // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    const options = {
      tag: tag,
      body: body,
      icon: icon,
      lang: 'en',
      dir: 'ltr',
      sound: './sound.mp3'  // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
    }
    this.setState({
      title: title,
      options: options
    });
  }
  handleButtonClick2() {
    this.props.swRegistration.getNotifications({}).then(function(notifications) {
      console.log(notifications);
    });
  }



  render() {
    return (
      <div className="App">
        <div><input type='text' onChange={ event=>{this.setState({inputText: event.target.value})} }/>
            <button onClick={this.buttonClick} >send</button>
            <div style={{color: 'blue'}}> {this.state.msg} </div>
         </div>
        <iframe src='http://localhost:8001' ref={this.refIframe}/>

        <button onClick={this.handleButtonClick.bind(this)}>Notif!</button>
        {document.title === 'swExample' && <button onClick={this.handleButtonClick2.bind(this)}>swRegistration.getNotifications</button>}
        <Notification
          ignore={this.state.ignore && this.state.title !== ''}
          notSupported={this.handleNotSupported.bind(this)}
          onPermissionGranted={this.handlePermissionGranted.bind(this)}
          onPermissionDenied={this.handlePermissionDenied.bind(this)}
          onShow={this.handleNotificationOnShow.bind(this)}
          onClick={this.handleNotificationOnClick.bind(this)}
          onClose={this.handleNotificationOnClose.bind(this)}
          onError={this.handleNotificationOnError.bind(this)}
          timeout={5000}
          title={this.state.title}
          options={this.state.options}
          swRegistration={this.props.swRegistration}
        />
        {/* <audio id='sound' preload='auto'>
          <source src='./sound.mp3' type='audio/mpeg' />
          <source src='./sound.ogg' type='audio/ogg' />
          <embed hidden={true} autostart='false' loop={false} src='./sound.mp3' />
        </audio> */}
        
        
      </div>
    )
  }

}

export default App;
