import { useEffect, useState } from 'react'
// import { useAppDispatch } from '../../hooks/useAppDispatch';
// import { useAppSelector } from '../../hooks/useAppSelector';
import axiosInstance from '../../helper/axiosInstance';

const TestAuth = () => {

  // const dispatch = useAppDispatch();
  //    const { user, token } = useAppSelector((state) => state.auth);

  const [userName, setUserName] = useState("");
  const getUserName = async () => {
    try {
      const userName = await axiosInstance.get("/auth/user");
      setUserName(userName.data.name);

    } catch (error) {

    }
  }
  useEffect(() => {
    getUserName();
  }, []);
  return (
    <div>
      {userName}
    </div>
  )
}

export default TestAuth
