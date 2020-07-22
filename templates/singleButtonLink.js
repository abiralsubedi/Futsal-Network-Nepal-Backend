module.exports = ({ fullName, plainText, buttonText, buttonLink }) => {
  return `
  <table style='min-width:320px;' width='100%' cellspacing='0' cellpadding='0' bgcolor='#f0f4f7'>
   <tbody>
      <tr>
         <td bgcolor='#F6EFFF' style='background: #2196f338;' valign='top' align='center'>
            <table style='margin:40px auto;' width='680' align='center' cellpadding='0' cellspacing='0'>
               <tbody>
                  <tr class='gmail-fix'>
                     <td>
                        <table cellpadding='0' cellspacing='0' border='0' align='center' width='680'>
                           <tr>
                              <td cellpadding='0' cellspacing='0' border='0' height='1'; style='line-height: 1px; min-width: 680px;'><img src='https://drive.google.com/thumbnail?id=1KK1HP0vtwDenX7z_O3Fo03ddwGMWRpU9' width='680' height='1' style='display: block; max-height: 1px; min-height: 1px; min-width: 680px; width: 680px;'/></td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td style='padding: 0 16px' valign='top'>
                        <table style='margin:40px auto' width='100%' cellspacing='0' cellpadding='0'>
                           <tbody>
                              <tr>
                                 <td align='center'><a href='https://apfyp.herokuapp.com' target='_blank'><img src='https://fyp-app-assets.s3.amazonaws.com/images/fyp-logo.png' width='100'></a></td>
                              </tr>
                           </tbody>
                        </table>
                        <table width='100%' cellspacing='0' cellpadding='0'>
                           <tbody>
                              <tr>
                                 <td style='border-radius:10px; box-shadow: 0 2px 32px -12px rgba(56,56,56,0.1); border-bottom:1px solid #ffffff' bgcolor='#ffffff' valign='top'>
                                    <table style='padding:40px 40px 16px' cellpadding='0' cellspacing='0'>
                                       <tbody style='font-size:16px; line-height:24px; color:#383838'>
                                          <tr>
                                             <td style='padding-bottom:30px;' class='open-sans'>Hi ${fullName},</td>
                                          </tr>
                                          <tr>
                                             <td style='padding-bottom:42px;'>${plainText}</td>
                                          </tr>
                                          <tr>
                                             <td style='padding-bottom:18px;'><a href='${buttonLink}' target='_blank' style='font-size: 18px; font-weight: 600; color:white; text-decoration: none; padding: 12px 32px; height: 48px; width: 224px; border-radius: 24px; background: #2196f3'>${buttonText}</a></td>
                                          </tr>
                                          <tr>
                                             <td style='padding:30px 0;'>Happy Surfing,<br>Abiral</td>
                                          </tr>
                                          <tr>
                                             <td>
                                                <table width='100%' cellspacing='0' cellpadding='0' style='border-top: 1px solid#F4F4F4; color:#8D8D8D; font-size: 11px;line-height: 16px; padding: 12px 0'>
                                                   <tbody>
                                                      <tr>
                                                         <td>We provide you the best service on demand 24x7.<br></td>
                                                         <td>The email expires in 24 hours.<br></td>
                                                      </tr>
                                                   </tbody>
                                                </table>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                    
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
   </tbody>
</table>
`;
};
