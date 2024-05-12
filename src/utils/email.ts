interface SendEmailPayload {
    from:string;
    to:string;
    subject:string;
    body:string;
}

export async function sendEmail(payload:SendEmailPayload){
    const {from,to,subject,body} = payload;
    return new Promise((resolve,reject)=>{      
        console.log(`Sending email from ${from} to ${to} with subject ${subject} and body ${body}`);
        setTimeout(() => {
            resolve(1);
        }, 2*1000);
    })
}

