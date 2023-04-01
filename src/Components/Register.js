import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../supabaseClient'
import { hashString } from 'react-hash-string';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const USER_REQ_REGEX = /^[a-zA-Z][a-zA-X0-9-_]{4,23}$/;
const PASSWORD_REQ_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&]){1,24}/;

const Register = () => {
    const { handleSubmit } = useForm()

    const userRef = useRef();
    const errRef = useRef();

    // variables for username input field 
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    // variables for password input field
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    // variables for password confim. input field
    const [confirmPwd, setConfirmPwd] = useState('');
    const [validConfirmPwd, setValidConfirm] = useState(false);
    const [confirmPwdFocus, setConfirmFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    // checks if the username input fits the requirements
    useEffect(() => {
        const result = USER_REQ_REGEX.test(user);
        // console.log(result);
        // console.log(user);
        setValidName(result);
    }, [user])

    // checks if the password input fits the requirements
    useEffect(() => {
        const result = PASSWORD_REQ_REGEX.test(pwd);
        // console.log(PASSWORD_REQ_REGEX.test('A!1abcdeft'))
        // console.log(result);
        // console.log(pwd);
        setValidPwd(result);
        const match = pwd == confirmPwd;
        setValidConfirm(match);
    }, [pwd, confirmPwd])

    // clears error message when user is typing in the field
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, confirmPwd])

    const submit = async (login) => {
        console.log(JSON.stringify(login))

        const { error } = await supabase.from('ibbLogin').insert(login)
        if (error == null) {
            setSuccess(true);
        } else {
            setErrMsg('Username already exist')
            console.log('error: ')
            console.log(error)
        }
    }


    return (
        <>
            {success ? (
                <section>
                    <h1>Account Created Successfully!</h1>
                    <p>
                        <Link to='/'>Sign In</Link>
                    </p>
                </section>
            ) : (
                <section>
                    {/* {console.log(PASSWORD_REQ_REGEX.test('aA1'))} */}
                    <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit(() => {
                        const v1 = USER_REQ_REGEX.test(user);
                        const v2 = PASSWORD_REQ_REGEX.test(pwd);
                        if (!v1 || !v2 || pwd != confirmPwd) {
                            return
                        }
                        console.log('submitting')
                        const loginInfo = user + ':' + pwd

                        const newLogin = {
                            id: hashString(user),
                            loginInfo
                        }

                        submit(newLogin);
                    })}>
                        <label htmlFor='username'>
                            Username:
                            <span className={validName ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validName || !user ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            className='text-black'
                            type='text'
                            id='username'
                            ref={userRef}
                            autoComplete='off'
                            onChange={(e) => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? 'false' : 'true'}
                            aria-describedby='uidnote'
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id='uidnote' className={userFocus && !user && !validName ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters. <br />
                            Must begin with a letter. <br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        <label htmlFor='password'>
                            Password:
                            <span className={validPwd ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validPwd || !pwd ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            className='text-black'
                            type='password'
                            id='password'
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? 'false' : 'true'}
                            aria-describedby='pwdnote'
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id='pwdnote' className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters. <br />
                            Must include uppercase and lowercase letters, a number and a special character. <br />
                            Allowed special characters: <span aria-label='exclamation mark'>!</span> <span aria-label='at symbol'>@</span>
                            <span aria-label='hashtag'>#</span> <span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
                            <span aria-label='and symbol'>&</span>
                        </p>
                        <label htmlFor='confirm-pass'>
                            Confirm Password:
                            <span className={validConfirmPwd && confirmPwd ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validConfirmPwd || !confirmPwd ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            className='text-black'
                            type='password'
                            id='confirm-pass'
                            onChange={(e) => setConfirmPwd(e.target.value)}
                            required
                            aria-invalid={validConfirmPwd ? 'false' : 'true'}
                            aria-describedby='confirmnote'
                            onFocus={() => setConfirmFocus(true)}
                            onBlur={() => setConfirmFocus(false)}
                        />
                        <p id='confirmnote' className={confirmPwdFocus && !validConfirmPwd ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field
                        </p>
                        <button type='submit' disabled={!validName || !validPwd || !validConfirmPwd ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered? <br />
                        <span className='line'>
                            {/* put router link here */}
                            <Link to='/'>Sign In</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}
export default Register