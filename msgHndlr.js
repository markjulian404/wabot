const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const get = require('got')
const color = require('./lib/color')
const { spawn, exec } = require('child_process')
const { downloader, getLocationData } = require('./lib')
const { isUrl } = require('./utils')
const { liriklagu, quotemaker, fb, sleep, jadwalTv, ss } = require('./lib/functions')
const { help, snk, info, donate, readme, listChannel, panggilan, upd, tg, td, tu, ti } = require('./lib/help')
const { stdout } = require('process')
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))

moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        const urle = args.length !== 0 ? args[0] : ''
        const msgs = (message) => {
            if (command.startsWith('#')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const mess = {
            wait: '[ SABAR ] Sedang di proses⏳ silahkan tunggu sebentar',
            error: {
                St: '[❗] Kirim gambar dengan caption *#sticker* atau tag gambar yang sudah dikirim',
                Qm: '[❗] Terjadi kesalahan, mungkin themenya tidak tersedia!',
                Yt3: '[❗] Terjadi kesalahan, tidak dapat meng konversi ke mp3!',
                Yt4: '[❗] Terjadi kesalahan, mungkin error di sebabkan oleh sistem.',
                Ig: '[❗] Terjadi kesalahan, mungkin karena akunnya private',
                Ki: '[❗] Bot tidak bisa mengeluarkan admin group!',
                Ad: '[❗] Tidak dapat menambahkan target, mungkin karena di private',
                Iv: '[❗] Link yang anda kirim tidak valid!',
                Lok: '[❗] Kirim lokasi dan tag lokasi tersebut dengan *#lokasi*',
                fbm: '[❗] Terjadi kesalahan, tidak dapat mengunduh video'
            }
        }

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const ownerNumber = '6282129962753@c.us'
        const isOwner = sender.id === ownerNumber
        const isBlocked = blockNumber.includes(sender.id)
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('#')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('#')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        if (!isGroupMsg && !command.startsWith('#')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        if (isGroupMsg && !command.startsWith('#')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
        //if (!isOwner) return
    switch(command) {
        case '#sticker':
        case '#stiker':
        if (isMedia && type === 'image') {
            const mediaData = await decryptMedia(message, uaOverride)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            await client.sendImageAsSticker(from, imageBase64)
        } else if (quotedMsg && quotedMsg.type == 'image') {
            const mediaData = await decryptMedia(quotedMsg, uaOverride)
            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
            await client.sendImageAsSticker(from, imageBase64)
        } else if (args.length === 2) {
            const url = args[1]
            if (url.match(isUrl)) {
                await client.sendStickerfromUrl(from, url, { method: 'get' })
                .catch(err => console.log('Caught exception: ', err))
            } else {
                client.reply(from, mess.error.Iv, id)
            }
        } else {
            client.reply(from, mess.error.St, id)
        }
        break

        case '#sim':
        if (args.length === 1) return client.reply(from, 'Kirim perintah *#sim pesan*',id)
            let simi = body.slice(5)
        const sm = await get.get('http://julianofficial.000webhostapp.com/api/simsimi?qs='+ simi).json()
            if (sm.pesan == "Error") return client.reply(from, 'Error mang',id)
                client.reply(from, sm["answer"], id)
        break

        case '#stickergif':
        case '#stikergif':
        case '#sgif':
        if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, '[SABAR] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
                    const filename = `./media/gir.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                    })
                } else (
                    client.reply(from, '[❗] Kirim video dengan caption *#stickerGif* max 10 sec!', id)
                )
            }
        break
        case '#donasi':
        case '#donate':
        client.sendLinkWithAutoPreview(from, donate)
        break
        case '#tts':
        if (args.length === 1) return client.reply(from, 'Kirim perintah *#tts [id, en, jp, ar] [teks]*, contoh *#tts id halo semua*')
            const ttsId = require('node-gtts')('id')
        const ttsEn = require('node-gtts')('en')
        const ttsJp = require('node-gtts')('ja')
        const ttsAr = require('node-gtts')('ar')
        const dataText = body.slice(8)
        if (dataText === '') return client.reply(from, 'Baka?', id)
            if (dataText.length > 500) return client.reply(from, 'Teks terlalu panjang!', id)
                var dataBhs = body.slice(5, 7)
            if (dataBhs == 'id') {
                ttsId.save('./media/tts/resId.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resId.mp3', id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resEn.mp3', id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resJp.mp3', id)
                })
            } else if (dataBhs == 'ar') {
                ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resAr.mp3', id)
                })
            } else {
                client.reply(from, 'Masukkan data bahasa : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, dan [ar] untuk arab', id)
            }
            break
            case '#nulis':
            case '#magernulis':
            case '#malesnulis':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#nulis [teks]*', id)
                const text = body.slice(7)
            client.reply(from, mess.wait, id)
            const splitText = text.replace(/(\S+\s*){1,10}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 25).join('\n')
            spawn('convert', [
                './media/img/before.jpg',
                '-font',
                'coming',
                '-size',
                '700x960',
                '-pointsize',
                '12',
                '-interline-spacing',
                '0',
                '-annotate',
                '+293+125',
                fixHeight,
                './media/img/after.jpg'
                ])
            .on('error', () => client.reply(from, 'Error gan', id))
            .on('exit', () => {
                client.sendImage(from, './media/img/after.jpg', 'hasil.jpg', 'Nih..', id)
            })
            break

            case '#berita':
            case '#news':
            if (args === 1) return client.reply(from, 'Terjadi kesalahan')
                const news = await get.get('https://api.haipbis.xyz/news').json()
            let ar = ''
            ar += '*BERITA HARI INI*\n'
            for (let i = 0; i < news.length; i++) {
                 ar += `*Judul :* ${news[i].title}\n*Sumber :* ${news[i].source}\n*Author :* ${news[i].author}\n*Link :* ${news[i].link}\n\n`
            }
            client.reply(from, ar, id)
            break

            case '#covid19':
            case '#covid':
            case '#corona':
            case '#statuscovid':
            if (args == 1) return client.reply(from, 'Kesalahan tidak terduga', id)
                const cv = await get.get('http://julianofficial.000webhostapp.com/api/covid.php').json()
             if (cv.error) return client.reply(from, cv.error, id)
                //client.reply(from, `${shh.result}`,id)
                tc      = '╔══✪〘 Data Covid-19 ID 〙\n'
                tc    +=  `╠➥Terkonfirmasi : *${cv.konfirmasi}*\n`
                tc    +=  `╠➥Kematian         : *${cv.kematian}*\n`
                tc    +=  `╠➥Sembuh           : *${cv.sembuh}*\n`
                tc    +=  '╚══✪〘 Kemenkes.go.id 〙'
                client.reply(from, tc,id)
                await sleep(2)
                client.sendText(from, 'Waduh!!! Tetap dirumah dan pakai masker ya :(',id)
                const aha = await get.get('http://julianofficial.000webhostapp.com/api/ytmp3.php?url=https://youtu.be/SSKeCJDwXhs').json()
                await client.sendFileFromUrl(from, `${aha["128"]}`, `pesanibu.mp3`, '', id)
            break

            case '#lokasi':
            case '#ceklokasi':
            if (!quotedMsg.type == 'location') return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
                console.log(`Request Status Zona Penyebaran Covid-19 (${quotedMsg.lat}, ${quotedMsg.lng}).`)
            const zoneStatus = await getLocationData(quotedMsg.lat, quotedMsg.lng)
            if (zoneStatus.kode !== 200) client.sendText(from, 'Maaf, Terjadi error ketika memeriksa lokasi yang anda kirim.')
                let data = ''
            for (let i = 0; i < zoneStatus.data.length; i++) {
                const { zone, region } = zoneStatus.data[i]
                const _zone = zone == 'green' ? 'Hijau* (Aman) \n' : zone == 'yellow' ? 'Kuning* (Waspada) \n' : 'Merah* (Bahaya) \n'
                data += `${i + 1}. Kel. *${region}* Berstatus *Zona ${_zone}`
            }
            const a = `*CEK LOKASI PENYEBARAN COVID-19*\nHasil pemeriksaan dari lokasi yang anda kirim adalah *${zoneStatus.status}* ${zoneStatus.optional}\n\nInformasi lokasi terdampak disekitar anda:\n${data}`
            client.sendText(from, a)
            break

            case '#ig':
            case '#instagram':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#ig [LinkIG]*, untuk contoh silahkan kirim perintah *#readme*')
            let isIgLinks = args[1].match(isUrl)
            if (!isIgLinks && !args[1].includes('instagram.com')) return client.reply(from, mess.error.Iv, id)
                try {
                    client.reply(from, mess.wait, id)
                    const igs = await get.get('http://julianofficial.000webhostapp.com/api/igd.php?url='+ args[1]).json()
                    if (igs.error) {
                        client.reply(from, igs.error, id)
                    } else {
                        const { nama, caption, like, comment } = igs
                         client.sendFileFromUrl(from, `${igs["result"]["thumb"]}`, `thumb.jpg`, `➸ *Sumber* : ${nama}\n➸ *Caption* : ${caption}\n➸ *Jumlah Like* : ${like}\n➸ *Jumlah Komentar* : ${comment}\n➸ *Durasi* : ${igs["result"]["duration"]}\n➸ *Download* : ${igs["result"]["video"]}\n`, id).catch(() => client.reply(from, mess.error.fbm, id))
                    }
                } catch (err) {
                    client.sendText(ownerNumber, 'Error Instagram : '+ err)
                    client.reply(from, mess.error.fbm, id)
                }
            break

            case 'bot':
            case '#bot':
            case 'hai bot':
            case 'hai boot':
            case '#hello':
            case 'hello':
            client.reply(from, panggilan, id)
            break
            case '#ytmp3':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#ytmp3 [linkYt]*, untuk contoh silahkan kirim perintah *#readme*')
                let isLinks = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLinks) return client.reply(from, mess.error.Iv, id)
                 try {
                        client.reply(from, mess.wait, id)
                        const resp = await get.get('http://julianofficial.000webhostapp.com/api/ytmp3.php?url='+ args[1]).json()

                        if (resp.error) {
                            client.reply(from, resp.error, id)
                        } else {
                            client.sendFileFromUrl(from, resp.img, 'thumb.jpg', `➸ *Title* : ${resp.title}\n➸ *Size* : ${resp.size}\n ➸ *128KBPs* : ${resp["128"]}`, id)
                        }
                    } catch (er) {
                        client.sendText(ownerNumber, 'Error ytmp3 : '+ er)
                        client.reply(from, mess.error.Yt3, id)
                    }
                
                break
                case '#ytmp4':
                if (args.length === 1) return client.reply(from, 'Kirim perintah *#ytmp4 [linkYt]*, untuk contoh silahkan kirim perintah *#readme*')
                    let mek = body.slice(7)
                    let isLin = mek.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                if (!isLin) return client.reply(from, mess.error.Iv, id)
                    try {
                        client.reply(from, mess.wait, id)
                        const ytv = await get.get('http://julianofficial.000webhostapp.com/api/ytmp4.php?url='+ mek).json()

                        if (ytv.error) {
                            client.reply(from, ytv.error, id)
                        } else {
                            client.sendFileFromUrl(from, ytv.img, 'thumb.jpg', `➸ *Title* : ${ytv.title}\n ➸ *360P* : ${ytv["360"]}\n ➸ *480P* : ${ytv["480"]}\n ➸ *720P* : ${ytv["720"]}`, id)
                        }
                    } catch (er) {
                        client.sendText(ownerNumber, 'Error ytmp4 : '+ er)
                        client.reply(from, mess.error.Yt4, id)
                    }
                    break
                    case '#wiki':
                    if (args.length === 1) return client.reply(from, 'Kirim perintah *#wiki [query]*\nContoh : *#wiki TNI*', id)
                        const query_ = body.slice(6)
                    const wiki = await get.get('http://julianofficial.000webhostapp.com/api/wiki?query='+ query_).json()
                    if (wiki.pesan == "Error") {
                        client.reply(from, 'Pencarian anda tidak di temukan', id)
                    } else {
                        client.reply(from, `➸ *Query* : ${query_}\n\n➸ *Result* : ${wiki.teks}`, id)
                    }
                    break
                    case '#cuaca':
                    client.reply(from, 'Fitur dalam perbaikan', id)
                    /*if (args.length === 1) return client.reply(from, 'Kirim perintah *#cuaca [tempat]*\nContoh : *#cuaca tangerang', id)
                        const tempat = body.slice(7)
                    const weather = await get.get('https://mhankbarbar.herokuapp.com/api/cuaca?q='+ tempat).json()
                    if (weather.error) {
                        client.reply(from, weather.error, id)
                    } else {
                        client.reply(from, `➸ Tempat : ${weather.result.tempat}\n\n➸ Angin : ${weather.result.angin}\n➸ Cuaca : ${weather.result.cuaca}\n➸ Deskripsi : ${weather.result.desk}\n➸ Kelembapan : ${weather.result.kelembapan}\n➸ Suhu : ${weather.result.suhu}\n➸ Udara : ${weather.result.udara}`, id)
                    }*/
                    break

                    case '#facebook':
                    case '#efbeh':
                    case '#fb':
                    if (args.length === 1) return client.reply(from, 'Kirim perintah *#fb [linkFb]* untuk contoh silahkan kirim perintah *#readme*', id)
                    let lfb = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?facebook?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                    if (!lfb) return client.reply(from, mess.error.Iv, id)
                    try {
                        client.reply(from, mess.wait, id)
                        const fb = await get.get('http://julianofficial.000webhostapp.com/api/fb.php?url='+ args[1]).json()
                        if (fb[0]["pesan"] == "Error") return client.reply(from, 'Tidak dapat mendownload video yang di private', id)
                        if (fb.error) {
                            client.reply(from, fb.error, id)
                        }else{
                            let sm = fb[0]["sumber"].split('&quot;')
                            let smb = sm.join('"')
                            client.sendText(from, `➸ *Sumber* : ${smb}\n➸ *Title* : ${fb[0]["title"]}\n➸ *Download HD* : ${fb[0]["quality"]["hd"]}\n➸ *Download SD* : ${fb[0]["quality"]["sd"]}`, id)
                        }
                    } catch (er) {
                        client.sendText(ownerNumber, 'Error facebook : '+ er)
                        client.reply(from, mess.error.fbm, id)
                    }
                    break

                    case '#creator':
                    client.sendContact(from, '6282129962753@c.us')
                    break

                    case '#ssweb':
                    if (args.length === 1) return client.reply(from, 'Kirim perintah *#ssweb youtube.com*', id)
                     const ps = body.slice(7)
                         const muach = await get.get(`https://api.haipbis.xyz/ssweb?url=${ps}`).json()
                           if (muach.error) return client.reply(from, muach.error, id)
                                   const { result } = muach
                              client.sendFileFromUrl(from, result, 'web.jpg', 'Ni Bro', id)
                               break 

                    case '#short':
                    if (args.length === 1) return client.reply(from, 'Kirim perintah *#short https://youtube.com*', id)
                        const sh = body.slice(7)
                    const shh = await get.get(`https://api.haipbis.xyz/bitly?url=${sh}`).json()
                    if (shh.error) return client.reply(from, shh.error, id)
                        client.reply(from, `${shh.result}`,id)
                    break 

                    case '#igstalk':
                    if (args.length === 1)  return client.reply(from, 'Kirim perintah *#igStalk @username*\nConntoh *#igStalk @markjulian404*', id)
                        const stalk = await get.get('http://julianofficial.000webhostapp.com/api/ig.php?username='+args[1]).json()
                    if (stalk.error) return client.reply(from, stalk.error, id)
                        const { nama, username, img, bio } = stalk
                    const caps = `➸ *Nama* : ${nama}\n➸ *Username* : ${username}\n➸ *Bio* : ${bio}\n➸ *Jumlah Followers* : ${stalk["profil"]["followers"]}\n➸ *Jumlah Following* : ${stalk["profil"]["following"]}\n➸ *Jumlah Postingan* : ${stalk["profil"]["post"]}`
                    await client.sendFileFromUrl(from, img, 'Profile.jpg', caps, id)
                    break
                    case '#infogempa':
                    client.reply(from, 'Fitur dalam perbaikan',id)
                    /*
                    const bmkg = await get.get('https://mhankbarbar.herokuapp.com/api/infogempa').json()
                    const { potensi, koordinat, lokasi, kedalaman, magnitude, waktu, map } = bmkg
                    const hasil = `*${waktu}*\n📍 *Lokasi* : *${lokasi}*\n〽️ *Kedalaman* : *${kedalaman}*\n💢 *Magnitude* : *${magnitude}*\n🔘 *Potensi* : *${potensi}*\n📍 *Koordinat* : *${koordinat}*`
                    client.sendFileFromUrl(from, map, 'shakemap.jpg', hasil, id)
                    */
                    break
                    case '#1':
                    case '#toolsgroup':
                    client.reply(from, tg, id)
                    break
                    case '#2':
                    case '#toolsdownload':
                    client.reply(from, td, id)
                    break
                    case '#3':
                    case '#toolsinformasi':
                    client.reply(from, ti, id)
                    break
                    case '#4':
                    case '#toolsumum':
                    client.reply(from, tu, id)
                    break
                    
                    case '#mp3':
                    if (args.length === 1) return client.reply(from, 'Kirim perintah #mp3 Judul Lagu', id)
                    client.reply(from, '_Sedang mencari lagu_',id)
                    const jdl = body.slice(5).split(' ').join('+')
                    const mptri = await get.get('http://julianofficial.000webhostapp.com/api/mp3?query='+jdl).json()
                    if (mptri["pesan"] == "Error") {
                        client.reply(from, 'Lagu tidak di temukan', id)
                    }else{
                        const { nama, durasi, thumb, link } = mptri
                        client.sendFileFromUrl(from, thumb, 'thumb.jpg', `➸ *Title* : ${nama}\n➸ *Durasi* : ${durasi}\n ➸ *Download* : ${link}`, id)
                    }
                    break
                    
                    case '#tiktok':
                    if (args.length === 1) client.reply(from, 'kirim perintah #tiktok [Url Video] tanpa "[" dan "]', id)
                        let tikod = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?tiktok(?:com)?\.(?:com|be)/)
                        if (!tikod) return client.reply(from, '_URL tidak valid_',id)
                            try {
                                client.reply(from, mess.wait, id)
                                const urltik = await get.get('http://julianofficial.000webhostapp.com/api/tiktok?url='+ args[1]).json()
                                if (urltik.pesan == "Error") {
                                    client.reply(from, 'Terjadi Kesalahan', id)
                                }else{
                                    const { thumb, link} = urltik
                                    client.sendFileFromUrl(from, `${thumb}`,`thumb.jpg`,`➸ *Download* : ${link}\nNih Broo..`, id)
                                }
                            }catch{
                            client.sendText(ownerNumber, 'Error tiktok : '+ er)
                            client.reply(from, mess.error.Yt4, id)
                            }
                    break
                    case '#brainly':
                    if (args.length === 1) client.reply(from, 'kirim perintah #brainly [Pertanyaan] tanpa "[" dan "]"', id)
                        let qs = body.slice(9).split(' ').join('+')
                        try {
                            client.reply(from, '_Sedang Mencari Pertanyaan Anda..._', id)
                            const urlbr = await get.get('http://julianofficial.000webhostapp.com/api/brainly?q='+ qs).json()
                            if (urlbr.pesan == "Error") {
                                client.reply(from, 'Tidak dapat menemukan pertanyaan anda', id)
                            }else{
                                const { question, answer} = urlbr
                                client.sendText(from, `➸ *Pertanyaan* : ${question}\n\n *Jawaban* : ${answer}\n`)
                            }
                        }catch{
                            client.sendText(ownerNumber, 'Error brainly : '+ er)
                            client.reply(from, mess.error.Yt4, id)
                        }
                        break
            case '#wait':
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Searching....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                	if (resolt.docs && resolt.docs.length <= 0) {
                		client.reply(from, 'Maaf, saya tidak tau ini anime apa', id)
                	}
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                    	teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                    }
                    teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                    teks += `➸ *Ecchi* : ${is_adult}\n`
                    teks += `➸ *Eps* : ${episode.toString()}\n`
                    teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                        client.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    client.reply(from, 'Error !', id)
                })
            } else {
                client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', 'Neh contoh mhank!', id)
            }
            break
            case '#quotemaker':
            /*arg = body.trim().split('|')
            if (arg.length >= 4) {
                client.reply(from, mess.wait, id)
                const quotes = arg[1]
                const author = arg[2]
                const theme = arg[3]
                await quotemaker(quotes, author, theme).then(amsu => {
                    client.sendFile(from, amsu, 'quotesmaker.jpg','neh...').catch(() => {
                       client.reply(from, mess.error.Qm, id)
                   })
                })
            } else {
                client.reply(from, 'Usage: \n!quotemaker |teks|watermark|theme\n\nEx :\n!quotemaker |ini contoh|bicit|random', id)
            }*/
            argu = body.trim().split('|')
            if (argu.length >= 3) {
                client.reply(from, mess.wait, id)
                const quotes = argu[1]
                const wm = argu[2]
                const r = await get.get(`http://julianofficial.000webhostapp.com/api/quotegenerator.php?quotes=${quotes}&wm=${wm}`)
                const re = await get.get(`http://julianofficial.000webhostapp.com/api/gambar.php`).json()
                await client.sendFileFromUrl(from, `${re.result}`, `result.jpg`, '', id)
            }
            break
            case '#linkgroup':
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (isGroupMsg) {
                    const inviteLink = await client.getGroupInviteLink(groupId);
                    client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
                } else {
                 client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
             }
             break
             case '#bc':
             if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
                let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) await client.sendText(ids, `【 *INFORMASI* 】\n\n${msg}`)
            }
        client.reply(from, 'Broadcast Success!', id)
        break
        case '#adminlist':
        if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            let mimin = ''
        for (let admon of groupAdmins) {
            mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
        }
        await sleep(2000)
        await client.sendTextWithMentions(from, mimin)
        break
        case '#ownergroup':
        if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const Owner_ = chat.groupMetadata.owner
        await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
        break
        case '#mentionall':
        case '#mentionall':
        if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins && !isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘 Keluarlah Para penghuni 〙\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠ *⇛* '
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 Mark Julian 〙'
            await sleep(2000)
            await client.sendTextWithMentions(from, hehe)
            break
            case '#kickall':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner && !isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                    const allMem = await client.getGroupMembers(groupId)
                for (let i = 0; i < allMem.length; i++) {
                    if (groupAdmins.includes(allMem[i].id)) {
                        console.log('Upss this is Admin group')
                    } else {
                        await client.removeParticipant(groupId, allMem[i].id)
                    }
                }
                client.reply(from, 'Succes kick all member', id)
                break
                case '#leaveall':
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
                    const allChats = await client.getAllChatIds()
                const allGroups = await client.getAllGroups()
                for (let gclist of allGroups) {
                    await client.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`)
                    await client.leaveGroup(gclist.contact.id)
                }
                client.reply(from, 'Succes leave all group!', id)
                break
                case '#clearall':
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
                    const allChatz = await client.getAllChats()
                for (let dchat of allChatz) {
                    await client.deleteChat(dchat.id)
                }
                client.reply(from, 'Succes clear all chat!', id)
                break
                case '#add':
                const orang = args[1]
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                    if (args.length === 1) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#add* 628xxxxx', id)
                        if (!isGroupAdmins && !isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                                try {
                                    await client.addParticipant(from,`${orang}@c.us`)
                                } catch {
                                    client.reply(from, mess.error.Ad, id)
                                }

                                break
                                case '#kick':
                                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                                    if (!isGroupAdmins && !isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                    if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                        if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *#kick* @tagmember', id)
                            client.sendText(from, `Perintah diterima, saya sudah menendang: ${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
                     for (let i = 0; i < mentionedJidList.length; i++) {
                         if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                            await client.removeParticipant(groupId, mentionedJidList[i])
                    }
                    break
                    case '#leave':
                    if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
                     if (!isGroupAdmins && !isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                        await client.sendText(from,'By By :-)').then(() => client.leaveGroup(groupId))
                    break
                    case '#promote':
                    if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                        if (!isGroupAdmins && !isOwner) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
                                if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#promote* @tagmember', id)
                                    if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
                                        if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
                                            await client.promoteParticipant(groupId, mentionedJidList[0])
                                        await client.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
                                        break
             case '#wmessage':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                welkom.push(chat.id)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur pesan selamat datang berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                welkom.splice(chat.id, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur pesan selamat datang berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break
                case '#demote':
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                    if (!isGroupAdmins && !isOwner) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                        if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
                            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#demote* @tagadmin', id)
                             if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
                                 if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
                                     await client.demoteParticipant(groupId, mentionedJidList[0])
                                 await client.sendTextWithMentions(from, `Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`)
                                 break
                                 case '#join':
                     //             if (args.length === 1) return client.reply(from, 'Kirim perintah *#join* linkgroup\n\nEx:\n!join https://chat.whatsapp.com/blablablablablabla', id)
                     //                 const link = body.slice(6)
                     //             const tGr = await client.getAllGroups()
                     //             const minMem = 30
                     //             const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
                     //             const check = await client.inviteInfo(link)
                     //             if (!isLink) return client.reply(from, 'Bro, Ini link? 👊🤬', id)
                     //                 if (tGr.length > 15) return client.reply(from, 'Maaf jumlah group sudah maksimal!', id)
                     // if (check.size < minMem) return client.reply(from, 'Member group tidak melebihi 30, bot tidak bisa masuk', id)
                     //     if (check.status === 200) {
                     //         await client.joinGroupViaLink(link).then(() => client.reply(from, 'Bot akan segera masuk!'))
                     //     } else {
                     //         client.reply(from, 'Link group tidak valid!', id)
                     //     }
                         break
                         case '#delete':
                         case '#del':
                         if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                             if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
  if (!quotedMsg) return client.reply(from, 'Salah!!, kirim perintah *#delete [tagpesanbot]*', id)
      if (!quotedMsgObj.fromMe) return client.reply(from, 'Salah!!, Bot tidak bisa mengahpus chat user lain!', id)
          client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
      break
      case '#getses':
      const sesPic = await client.getSnapshot()
      client.sendFile(from, sesPic, 'session.png', 'Neh...', id)
      break
      case '#lirik':
      if (args.length == 1) return client.reply(from, 'Kirim perintah *#lirik [optional]*, contoh *#lirik Lily*', id)
          const lagu = body.slice(7)
      const lirik = await liriklagu(lagu)
      client.reply(from, lirik, id)
      break

      case '#twit':
      case '#twitter':
      case '#twiter':
      if (args.length === 1) return client.reply(from, 'Masukan perintah *#twit link video* ',id)
        const lnk = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?twitter(?:com)?\.(?:com|be)/)
        if (!lnk) return client.reply(from, mess.error.Iv, id)
            const unk = await get.get('http://julianofficial.000webhostapp.com/api/twit?url='+ args[1]).json()
        if (unk["pesan"] == "Error") {
            client.reply(from, 'Terjadi kesalahan,tidak dapat mengunduh video',id)
        }else{
            const { title, thumb, durasi, link} = unk
            client.sendFileFromUrl(from, `${thumb}`,`thumb.jpg`,`» *Title :* ${title}\n» *Durasi :* ${durasi}\n» *Download :* ${link}`, id)
        }
      break

      case '#twitstalk':
      case '#tstalk':
        if (args.length === 1) return client.reply(from, 'Masukan perintah *#twitstalk @username* ',id)
            const stk = await get.get('http://julianofficial.000webhostapp.com/api/twstalk?u='+ args[1]).json()
        if (stk["pesan"] == "Error") {
            client.reply(from, 'Terjadi kesalahan,user tidak di temukan',id)
        }else{
            client.sendFileFromUrl(from, `${stk["profil"]}`,`thumb.jpg`,`» *Nama :* ${stk["nama"]}\n» *Username :* @${stk["uname"]}\n» *Followers :* ${stk["followers"]}\n» *Following :* ${stk["following"]}\n» *Twets :* ${stk["twets"]}`, id)
        }
      break
      case '#chord':
      client.reply(from, 'Dalam perbaikan',id)
      /*if (args.length === 1) return client.reply(from, 'Kirim perintah *#chord [query]*, contoh *#chord aku bukan boneka*', id)
          const query__ = body.slice(7)
      const chord = await get.get('https://mhankbarbar.herokuapp.com/api/chord?q='+ query__).json()
      if (chord.error) return client.reply(from, chord.error, id)
          client.reply(from, chord.result, id)*/
      break
      case '#listdaerah':
      const listDaerah = await get('https://mhankbarbar.herokuapp.com/daerah').json()
      client.reply(from, listDaerah, id)
      break
      case '#listblock':
      let hih = `Orang orang yang di block\nTotal : ${blockNumber.length}\n`
      for (let i of blockNumber) {
          hih += `➸ @${i.replace(/@c.us/g,'')}\n`
      }
      client.sendTextWithMentions(from, hih, id)
      break
      case '#jadwalshalat':
      if (args.length === 1) return client.reply(from, '[❗] Kirim perintah *#jadwalShalat [daerah]*\ncontoh : *#jadwalShalat Tangerang*\nUntuk list daerah kirim perintah *#listDaerah*')
          const daerah = body.slice(14)
      const js = await get.get(`http://julianofficial.000webhostapp.com/api/jadwalshalat.php?daerah=${daerah}`).json()
      if (js.error) return client.reply(from, js.error, id)
      const resultJadwal = `Jadwal shalat di *${daerah}*\n【 *${js["format"]["tanggal"]}* - *${js["format"]["bulan"]}* - *${js["format"]["tahun"]}* 】\n\nImsyak » *${js["waktu"]["imsyak"]}*\nSubuh » *${js["waktu"]["subuh"]}*\nDhuha » *${js["waktu"]["dhuha"]}*\nDzuhur » *${js["waktu"]["dzuhur"]}*\nAshar » *${js["waktu"]["ashar"]}*\nMaghrib » *${js["waktu"]["maghrib"]}*\nIsya » *${js["waktu"]["isya"]}*`
      client.reply(from, resultJadwal, id)
      break
      case '#listchannel':
      client.reply(from, listChannel, id)
      break
      case '#jadwaltv':
      if (args.length === 1) return client.reply(from, 'Kirim perintah *#jadwalTv [channel]*', id)
          const query = body.slice(10).toLowerCase()
      const jadwal = await jadwalTv(query)
      client.reply(from, jadwal, id)
      break
      case '#jadwaltvnow':
      const jadwalNow = await get.get('https://api.haipbis.xyz/jadwaltvnow').json()
      client.reply(from, `Jam : ${jadwalNow.jam}\n\nJadwalTV : ${jadwalNow.jadwalTV}`, id)
      break
      case '#quote':
      case '#quotes':
      const quotes = await get.get('https://mhankbarbar.herokuapp.com/api/randomquotes').json()
      client.reply(from, `➸ *Quotes* : ${quotes.quotes}\n➸ *Author* : ${quotes.author}`, id)
      break

      case '#cekno':
      if (args.length === 1) return client.reply(from, 'Kirim perintah *#cekno 082123xxxx*', id)
          const qry = body.slice(7)
      const ceknum = await get.get(`https://api.haipbis.xyz/phonenumber?no=${qry}`).json()
      client.reply(from, `International : ${ceknum.international}\nNational : ${ceknum.national}\nProvider : ${ceknum.provider}\nType : ${ceknum.location}\nTime Zone : ${ceknum.timezones}\n`, id)
      break

      case '#meme':
      const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
      const { postlink, title, subreddit, url, spoiler } = response.data
      client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
      break
      case '#help':
      client.sendText(from, help)
      break
      case '#readme':
      client.reply(from, readme, id)
      break
      case '#info':
      client.sendText(from, info)
      break
      case '#snk':
      client.reply(from, snk, id)
      break
  }
                             } catch (err) {
  console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
