import React, { useState ,useEffect, useReducer,useContext} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer=(state,action)=>{
  if(action.type==='USER_INPUT'){
    return{value:action.val, isvalid:action.val.includes('@')};
  }
  if(action.type==='INPUT_BLUR'){
    return{value:state.value, isvalid:state.value.includes('@')};
  }
  return{value:'', isvalid:false};
}

const passwordReducer=(state,action)=>{
  if(action.type==='USER_INPUT'){
    return{value:action.val, isvalid:action.val.trim().length>6};
  }
  if(action.type==='INPUT_BLUR'){
    return{value:state.value, isvalid:state.value.trim().length>6};
  }
  return{value:'', isvalid:false};
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [enteredCollege, setEnteredCollege] = useState('');
  const [collegeIsValid, setCollegeIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const[emailState,dispacthEmail]= useReducer(emailReducer,{value:'',isvalid:null})

  const[passwordState,dispacthPassword]=useReducer(passwordReducer,{value:'',isvalid:null})

  const authCtx=useContext(AuthContext)

  useEffect(()=>{
    console.log('EFFECT RUNNING')
     
    return ()=>{
        console.log('EFFECT CLEANUP')
    }
  },[])

  const {isvalid:emailIsValid}=emailState;

  const{isvalid:passwordIsValid}=passwordState;

  useEffect(()=>{
    console.log('Cheking for validity');

    const identifier=setTimeout(()=>{
        setFormIsValid(
            emailState.isvalid && passwordState.isvalid && enteredCollege.trim()!==''
          );
    },500)

    return () =>{
        console.log('CLEANUP')
        clearTimeout(identifier);
    }


  },[emailState.isValid,passwordState.isValid,enteredCollege])

  const emailChangeHandler = (event) => {
    dispacthEmail({type:'USER_INPUT', val:event.target.value});

    // setFormIsValid(
    //     emailState.isvalid && passwordState.isvalid && enteredCollege.trim()!==''
    //  );
  };

  const passwordChangeHandler = (event) => {
    dispacthPassword({type:'USER_INPUT',val:event.target.value})

    // setFormIsValid(
    //   emailState.isvalid && passwordState.isvalid && enteredCollege.trim()!==''
    // );
    
  };

  const collegeChangeHandler = (event) => {
    setEnteredCollege(event.target.value);
    setFormIsValid(
        emailState.isvalid && passwordState.isvalid && event.target.value.trim()!==''
      );
  };

  const validateEmailHandler = () => {
   dispacthEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispacthPassword({type:'INPUT_BLUR'})
  };

  const validateCollegeHandler = () => {
    setCollegeIsValid(enteredCollege.trim()!=='');
  };

  const submitHandler = (event) => {
    event.preventDefault();
    
    authCtx.onLogin(emailState.value, passwordState.value,enteredCollege);
  };


  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        
        <Input 
          id='email' 
          label='E-mail' 
          type='email' 
          isValid={emailIsValid} 
          value={emailState.value} 
          onChange={emailChangeHandler} 
          onBlur={validateEmailHandler}
          
        />
          <Input 
          id='password' 
          label='Password' 
          type='password' 
          isValid={passwordIsValid} 
          value={passwordState.value} 
          onChange={passwordChangeHandler} 
          onBlur={validatePasswordHandler}
          
        />

            <div
          className={`${classes.control} ${
            collegeIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="college">College Name</label>
          <input
            type="text"
            id="college"
            value={enteredCollege}
            onChange={collegeChangeHandler}
            onBlur={validateCollegeHandler}
          />
        </div>

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;