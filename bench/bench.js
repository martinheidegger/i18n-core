const cluster = require('cluster')
const Readable = require('stream').Readable
const stringify = require('csv-stringify')

function exec (fn) {
  var execCount = parseInt(process.env.TEST_EXEC_COUNT, 10)
  var min = Number.MAX_VALUE
  var max = 0
  var avg = 0
  for (var i = 0; i < execCount; i += 1) {
    var start = process.hrtime()
    fn()
    var diff = process.hrtime(start)
    var time = (diff[0] * 1e9 + diff[1]) * 0.000001
    if (time < min) {
      min = time
    }
    if (time > max) {
      max = time
    }
    avg += time / execCount
  }
  return {
    min: min,
    max: max,
    avg: avg,
    count: execCount
  }
}

function cpuTest (options) {
  var count = parseInt(process.env.TEST_SETUP_COUNT, 10)
  var res = {}
  options.run(fn => {
    if (fn.name !== process.env.TEST_NAME) {
      return
    }
    for (var i = 0; i < count; i += 1) {
      var setupStart = process.hrtime()
      var fnX = options.prepareOne(fn)
      var setupDiff = process.hrtime(setupStart)
      var setupTime = (setupDiff[0] * 1e9 + setupDiff[1]) * 0.000001
      var execRes = exec(fnX)
      if (i === 0) {
        res.setup = {
          max: setupTime,
          avg: setupTime / count,
          min: setupTime
        }
        res.exec = execRes
      } else {
        if (setupTime < res.setup.min) {
          res.setup.min = setupTime
        }
        if (setupTime > res.exec.max) {
          res.setup.max = setupTime
        }
        res.setup.avg += setupTime / count
        res.exec.count += execRes.count
        if (execRes.min < res.exec.min) {
          res.exec.min = execRes.min
        }
        if (execRes.max > res.exec.max) {
          res.exec.max = execRes.max
        }
        res.exec.avg += execRes.avg / count
      }
      var diff = process.hrtime(setupStart)
      var time = (diff[0] * 1e9 + diff[1]) * 0.000001
      res.setup.count = count
      res.totalTime = time
    }
  })
  res.mem = process.memoryUsage()
  process.send(JSON.stringify(res))
  process.exit()
}

function fork (env) {
  return new Promise((resolve, reject) => {
    var worker = cluster.fork(env)
    worker.on('message', msg => resolve(JSON.parse(msg)))
  })
}

function totalTest (options) {
  var tests = []
  options.run(fn => {
    var actual = options.prepareOne(fn)
    // Testing the functionality
    actual()
    tests.push(fn.name)
  })
  var readableStream = new Readable({
    objectMode: true
  })
  var combinations = options.times.reduce((combis, execTime) => {
    return combis.concat(tests.map(fnName => ({execTime, fnName})))
  }, [])
  readableStream._read = () => {
    if (combinations.length === 0) {
      readableStream.push(null)
      return
    }
    var combi = combinations.shift()
    fork({
      TEST_NAME: combi.fnName,
      TEST_SETUP_COUNT: combi.execTime[0],
      TEST_EXEC_COUNT: combi.execTime[1]
    }).then(cpu => {
      cpu.name = combi.fnName
      readableStream.push(cpu)
    })
  }
  readableStream.pipe(stringify({
    header: true,
    columns: [
      'name',
      'totalTime',
      'mem.rss',
      'mem.heapTotal',
      'mem.heapUsed',
      'mem.external',
      'setup.count',
      'setup.min',
      'setup.avg',
      'setup.max',
      'exec.count',
      'exec.min',
      'exec.max',
      'exec.avg'
    ]
  })).pipe(process.stdout)
}

if (cluster.isMaster) {
  module.exports = totalTest
} else {
  module.exports = cpuTest
}
