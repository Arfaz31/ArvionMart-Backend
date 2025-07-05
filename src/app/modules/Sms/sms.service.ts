import axios from 'axios'

const generateCsmsId = () => {
  return `${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')}${Math.random().toString(36).substring(2, 10)}`
}

const sendSms = async (payload: any) => {
  const smsPayload = {
    api_token: '2md2pi5j-edyxrgc6-3oqnujnx-jsmtdgpt-gccwpdxd',
    sid: 'ATCBRAND',
    msisdn: payload.contactNumber,
    sms: `আপনার অর্ডার সফল হয়েছে। TK: ${payload.totalPrice} - infinityhubbd`,
    csms_id: generateCsmsId(),
  }

  try {
    const sendRequest = await axios({
      method: 'POST',
      url: 'https://smsplus.sslwireless.com/api/v3/send-sms',
      headers: {
        'Content-Type': 'application/json',
      },
      data: smsPayload,
    })

    return sendRequest.data
  } catch (error: any) {
    console.error('SMS Sending Error:', error.message)
    throw new Error('Failed to send SMS')
  }
}

export const SmsService = {
  sendSms,
}
