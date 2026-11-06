// Pure camera tour: all displayed values derive from the same time/state.
export const VIEWS={hero:{az:.42,el:.19,d:9.9},side:{az:.02,el:.035,d:10.2},rear:{az:-.72,el:.18,d:10.2},top:{az:.12,el:1.18,d:10.4}};
export const FEATURES=[{title:'Dáng tổng thể',short:'TỔNG THỂ',text:'Thân dài, các mặt vát và tay cầm nghiêng được dựng theo ảnh nhìn ngang.',point:[.7,1,.3]}, {title:'Đường nét bên ngoài',short:'ĐƯỜNG NÉT',text:'Quan sát đường bao, chuyển tiếp bề mặt và các điểm nhấn trang trí.',point:[-1.05,.88,.3]}, {title:'Bề mặt tay cầm',short:'BỀ MẶT',text:'Mảng cao su tối và họa tiết nhám tương phản với lớp kim loại satin.',point:[-1.4,-.6,.31]}];
export function stateAt(t){
 const time=((t%24)+24)%24,index=Math.floor(time/6),local=time%6;
 const names=['hero','side','rear','hero'],from=VIEWS[names[index]],to=VIEWS[names[(index+1)%4]];
 const q=Math.max(0,Math.min(1,(local-4)/2)),u=q*q*(3-2*q);
 return {az:from.az+(to.az-from.az)*u,el:from.el+(to.el-from.el)*u,d:from.d+(to.d-from.d)*u,view:names[index],feature:[0,1,2,0][index],finish:index===2?'graphite':'silver',roughness:.36,light:1.0,progress:time/24,auto:true,labels:true};
}
