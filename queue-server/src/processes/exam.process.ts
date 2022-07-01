import { Job } from 'bull'
import axios from 'axios'

const examProcess = (job: Job, done: any) => {
    console.log('App processing: ' + JSON.stringify(job.data))
    const type = job.data?.type
    if (type === 'exam') {
        const process = axios
            .post('http://ec2-18-118-107-150.us-east-2.compute.amazonaws.com:5000/api/v1/exam/submit', job.data)
            .then((response: any) => {
                done()
                return response?.data
            })
            .catch((err: any) => {
                console.log(err)
            })
    } else {
        const process = axios
            .post('http://ec2-18-118-107-150.us-east-2.compute.amazonaws.com:5000/api/v1/pricing/expire', job.data)
            .then((response: any) => {
                done()
                return response.data
            })
            .catch((err: any) => {
                console.log(err)
            })
    }
}

export default examProcess
