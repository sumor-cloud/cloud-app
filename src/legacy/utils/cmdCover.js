import root from '../../../root.js'
export default version => {
  console.log(`
=================================================================
       =         
    = === =      Sumor Cloud Application v${version}
  = ======= =    
    = === =      More Information: https://sumor.cloud
       =         
=================================================================
  SCA library is located at:
    - ${root}
  Application is located at:
    - ${process.cwd()}
`)
}
