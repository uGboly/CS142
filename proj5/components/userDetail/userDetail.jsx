import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
import {Link}from 'react-router-dom';
import './userDetail.css';
import fetchModel from '../../lib/fetchModelData';


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.user = null; 
    fetchModel(`http://localhost:3000/user/${this.props.match.params.userId}`)
    .then(res => {
      this.user = res.data;
      this.props.changeContext('user', this.user.first_name + " " + this.user.last_name);
    })
    .catch(err => console.log(err));
  }

  //react只在state更新的情况下重新render组件。
  //在userList界面点击不同userlink时，浏览器显示的url与HashRouter传给userDetail组件的props更新了
  //但因为state没有更新，所以页面不会刷新
  //使用componentDidUpdate（）可以让组件在props更新时重新render，强制刷新页面
  //因为componentDidUpdate（）在props和state更新时都会调用，因此在componentDidUpdate（）中更新state会使其无限循环调用
  //为解决这一问题，我使用if 语句判断componentDidUpdate（）是否是因props变化而被调用，如果不是就不采取任何行动，避免componentDidUpdate（）被循环调用
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      fetchModel(`http://localhost:3000/user/${this.props.match.params.userId}`)
      .then(res => {
        this.user = res.data;
        this.props.changeContext('user',this.user.first_name + " " + this.user.last_name);
      })
      .catch(err => console.log(err));
    }
  }

  render() {
    if (!this.user) {
      return '';
    }      
    return (
      <Card>
        <CardContent>
          <h2>
            {this.user.first_name + " " + this.user.last_name}
          </h2>
          <List>
            <ListItem>
              <ListItemText primary={`Location: ${this.user.location}`}/>
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemText primary={`Occupation: ${this.user.occupation}`}/>
            </ListItem>
            <Divider/> 
            <ListItem>
              <ListItemText primary={`Description: ${this.user.description}`}/>
            </ListItem>
            <Divider/>
          </List>

        </CardContent>
        <CardActions>
          <Link to={`/photos/${this.user._id}`}>
            <Button>details</Button>
          </Link> 
        </CardActions>
      </Card>
      
      
    );
  }
}
export default UserDetail;
