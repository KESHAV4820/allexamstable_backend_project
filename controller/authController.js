'use strict';

const signup = (request, response, next) => {response.status(200).json({
    status: 'success',
    message: 'Signup route is working'
})};

module.exports={signup};