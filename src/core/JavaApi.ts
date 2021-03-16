/// <reference types="node" />
import * as fs from 'fs'
import * as j from 'java'
import * as util from 'util'

const javaNodeApi: j.NodeAPI = j

const PGX_CLASSPATH: string = process.env.PGX_CLASSPATH || ''

if (
  PGX_CLASSPATH == '' ||
  fs.existsSync(PGX_CLASSPATH) === false ||
  fs.statSync(PGX_CLASSPATH).isFile() === true
) {
  throw new Error(
    `PGX_CLASSPATH: (${PGX_CLASSPATH}) can't find or not be a valid absolute path.`,
  )
}

fs.readdirSync(PGX_CLASSPATH).forEach((f: string) => {
  javaNodeApi.classpath.push(PGX_CLASSPATH + '/' + f)
})

javaNodeApi.asyncOptions = {
  asyncSuffix: undefined,
  syncSuffix: 'Sync',
  promiseSuffix: '',
  promisify: util.promisify,
}

/*
Avoid Guice warnings
============================================================
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by com.google.inject.internal.cglib.core.$ReflectUtils$1 (guice.jar) to method java.lang.ClassLoader.defineClass(java.lang.String,byte[],int,int,java.security.ProtectionDomain)
WARNING: Please consider reporting this to the maintainers of com.google.inject.internal.cglib.core.$ReflectUtils$1
WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
WARNING: All illegal access operations will be denied in a future release
============================================================
*/
javaNodeApi.options.push('--add-opens=java.base/java.lang=ALL-UNNAMED')

const log4j2ConfigPath: string = `${PGX_CLASSPATH}/log4j2.xml`
if (
  fs.existsSync(log4j2ConfigPath) === true &&
  fs.statSync(log4j2ConfigPath).isFile() === true
) {
  javaNodeApi.callStaticMethodSync(
    'java.lang.System',
    'setProperty',
    'log4j.configurationFile',
    log4j2ConfigPath,
  )
}

export default javaNodeApi
