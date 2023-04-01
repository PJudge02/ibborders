import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
// import { useForm } from 'react-hook-form';

const Login = () => {
    const { setAuth } = useAuth();
    // const {handleSubmit} = useForm();
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSucess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleLogin = async (e) => {
        e.preventDefault();
        // setSucess(true);
        const loginInfo = user + ':' + pwd;

        let { data: ibbLogin, error } = await supabase
            .from('ibbLogin').select().eq('loginInfo', loginInfo)


        // console.log(`error is ${error}`);
        if (ibbLogin.length > 0) {
            console.log('success!');
            setAuth({user, pwd})
            setSucess(true);
        } else {
            console.log(ibbLogin);
            console.log(error);
            setErrMsg('Problem');
        }

    }

    return (
        <>
            {success ? (
                <>
                    < Navigate to='/OrderInfo' />
                </>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor='username'>Username:</label>
                        <input
                            className='text-black'
                            type='text'
                            id='username'
                            ref={userRef}
                            autoComplete='off'
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />
                        <label htmlFor='password'>Password:</label>
                        <input
                            className='text-black'
                            type='password'
                            id='password'
                            autoComplete='off'
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account? <br />
                        <span className='line'>
                            <Link to='/NO_YOU_CANT'>Register</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login