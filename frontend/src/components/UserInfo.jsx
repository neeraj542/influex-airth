import React, { useEffect, useState } from 'react';
import { fetchUserInfo } from '../api';

const UserInfo = ({ accessToken }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchUserInfo(accessToken)
        .then((data) => setUserInfo(data))
        .catch((error) => console.error(error));
    }
  }, [accessToken]);

  if (!userInfo) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h3 className="text-lg font-bold">User Info</h3>
      <p><strong>ID:</strong> {userInfo.id}</p>
      <p><strong>Username:</strong> {userInfo.username}</p>
    </div>
  );
};

export default UserInfo;
