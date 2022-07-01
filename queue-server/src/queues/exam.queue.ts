const sendExamQueue = ({ examQueue, ...rest }: any) => {
    examQueue.add(rest, {
        delay: rest?.time ? rest?.time * 1000 : 9000000,
        removeOnComplete: true,
    })
}

export { sendExamQueue }
