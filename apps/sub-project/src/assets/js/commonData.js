const rolehome = [
  'teacherhomne',
  'adminhome',
  'superadminhome',
  'secretariatehome',
  'academicaffairshome',
  'deanhome',
  'departmenthome',
  'majormanagerhome',
  'coursemanagerhome',
  'professionhome',
  'assistanthome',
  'courseteacherhome',
  'studenthome',
  'page'
];

function generateExportObject(roleArray) {
  const exportObject = roleArray.reduce((acc, role) => {
    const constantName = role.toUpperCase(); // 将角色名转换为大写
    acc[constantName] = role; // 将键值对存储到对象中
    return acc;
  }, {});

  return exportObject; // 返回生成的对象
}

// 直接导出生成的常量对象
export default generateExportObject(rolehome);
