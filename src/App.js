import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
import './App.css';
import { Component } from 'react';

const initialState = {
  input: '',
  imageUrl: '',
  boxKey: 0,
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (prmuser) => {
    this.setState({user: {
      id: prmuser.id,
      name: prmuser.name,
      email: prmuser.email,
      entries: prmuser.entries,
      joined: prmuser.joined
    }})
  }

  displayFaceBox = (response, inputBoxKey) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    const prmbox = {
      leftCol: response.left_col * width,
      topRow: response.top_row * height,
      rightCol: width - (response.right_col * width),
      bottomRow: height - (response.bottom_row * height)
    }

    this.setState(prevState => ({
      boxes: [...prevState.boxes, {
            key: inputBoxKey,
            leftCol: prmbox.leftCol,
            topRow: prmbox.topRow,
            rightCol: prmbox.rightCol,
            bottomRow: prmbox.bottomRow
          }]
    }))
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  incrementUserEntryCount = () => {
    fetch('http://localhost:3000/increment', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          id: this.state.user.id
      })
    })
    .then(userEntries => userEntries.json())
    .then(userEntries => {
      if(userEntries){
        this.setState(Object.assign(this.state.user, {entries: userEntries}));
      }
    })
  }

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});

    this.setState({ boxes: [] })

      fetch('http://localhost:3000/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: this.state.user.id,
            imageUrl: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response){
          this.setState(Object.assign(this.state.user, {entries: this.state.user.entries}));
          let inputBoxKey = 1;
          for (const region of response) {
              this.displayFaceBox(region.region_info.bounding_box, inputBoxKey);
              ++inputBoxKey;
          }

          this.incrementUserEntryCount();
        }
      })
      .catch(console.log)
  }

  onRouteChange = (routePrm) => {
    if(routePrm === "signout"){
      this.setState(initialState)
    }
    else if(routePrm === "home"){
      this.setState({isSignedIn: true})
    }

    this.setState({route: routePrm});
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;

    return (
      <div className="App">
        <ParticlesBg className="particals"  type="circle" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' ? 
          <div> 
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onPictureSubmit={this.onPictureSubmit} />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
        </div>
          :  
        (route === 'signin' 
        ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> )
      }
      </div>
    );    
  }

}

export default App;
