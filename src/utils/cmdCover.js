import root from '../../root.js'
export default (context, version) => {
  // 首字母大写
  // const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  // const mode = capitalize(context.mode);
  console.log(`
========================================================
       =         
    = === =      Sumor App Framework v${version}
  = ======= =    
    = === =      More Information: https://www.sumor.com
       =         
       
  当前使用的轻呈云依赖库位于${root}
  当前使用的轻呈云应用位于${process.cwd()}
========================================================
`)
}
