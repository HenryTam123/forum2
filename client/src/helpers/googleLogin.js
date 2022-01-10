import axios from '../axios'

export async function handleGoogleLogin(googleData) {
    const { data } = await axios.post('/api/v1/auth/google', { token: googleData.tokenId });
    localStorage.setItem('googleLoginData', JSON.stringify(data));
    return data
}

