export default function(name,blob){
  let a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=name;
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
