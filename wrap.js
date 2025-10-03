(async () => {
  const bufs = []; for await (const c of process.stdin) bufs.push(c);
  process.stdout.write(JSON.stringify({ ok: true, echo: String(Buffer.concat(bufs)) }));
})().catch(e=>process.stdout.write(JSON.stringify({error:String(e)})));
