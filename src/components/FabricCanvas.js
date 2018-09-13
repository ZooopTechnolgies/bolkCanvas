import React from "react";
import { connect } from "react-redux";
import Rnd from "../utils/react-rnd-rotate";
import {
  VideoPlayer,
  TextComponent,
  ImageComponent,
  Rectangle,
  Circle,
  Triangle,
  Star,
  TextTwoTemplate,
  TextSideTemplate,
  TextThreeTemplate,
  HalfArc,
  Meme
} from "./ObjectComponents";
var createReactClass = require("create-react-class");
var FontAwesome = require("react-fontawesome");

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 0px #ddd",
  background: "white",
  marginTop: "50px",
  marginLeft: "50px"
};

const handleTopLeftStyles = {
  width: "12px",
  height: "12px",
  left: "-6px",
  top: "-6px"
};
const handleTopRightStyles = {
  width: "12px",
  height: "12px",
  right: "-6px",
  top: "-6px"
};
const handleBottomRightStyles = {
  width: "12px",
  height: "12px",
  right: "-6px",
  bottom: "-6px"
};
const handleBottomLeftStyles = {
  width: "12px",
  height: "12px",
  bottom: "-6px",
  left: "-6px"
};
const handleTopCenterStyles = {
  width: "12px",
  height: "12px",
  left: "50%",
  top: "-6px",
  marginLeft: "-6px"
};

const handleRightCenterStyles = {
  width: "12px",
  height: "12px",
  right: "-6px",
  marginTop: "-6px",
  top: "auto"
};
const handleBottomCenterStyles = {
  width: "12px",
  height: "12px",
  left: "50%",
  marginTop: "-6px",
  top: "100%"
};
const handleLeftCenterStyles = {
  width: "12px",
  height: "12px",
  left: "-6px",
  marginTop: "-6px",
  top: "auto"
};
const handleRotateStyles = {
  width: "25px",
  height: "22px",
  top: "-35px",
  left: "49%",
  marginLeft: "-8px",
  border: "none",
  borderRadius: "initial",
  boxShadow: "none",
  backgroundColor: "transparent",
  cursor: `url(${"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAK8lJREFUeAHtXQeYVEW6JTjCzJAECUocDKAICipgRmRFQEQF9SnIU0RW132AGNcckDWygLoi5gVZI4qKqIuLCZ7iQwUWAUWQIEElZxB851z7tDVNT+iZrurbPVXfd7vuvX1v1V+n6tT/V7zlynnnEfAIeAQ8Ah4Bj4BHwCPgEfAIeAQ8Ah4Bj4BHwCPgEfAIeAQ8Ah4Bj4BHwCPgEfAIeAQ8Ah4Bj4BHwCPgEfAIeAQ8Ah4Bj4BHwCPgEfAIeAQ8Ah4Bj4BHwCPgEfAIeAQ8Ah4Bj4BHwCPgEfAIeAQ8Ah6B+AiUj3/b300SAia+BZ0nEtWvxsMFnRuP+NPSImBmWmnDKuvvC8t4vnnPPBdmuqdr+fFIwHu6H3vO98z/FI73S4hAQRlTwuDK1GvETvjpvDC/QuR5PUOwzHNd01ch17muRQj6eyLPmffinceGwWvviokAM8i74iEgrFSoTV+Fn368g8+a9813dR5PingFnsTQIaLo2vT1X7wwGBfve1cEAswc7wpGQPioEMs3CzvPK8Ycsfd0bb6nsEzflCRewTYJsBsP85q+jthrPWO+Fxsu4/RkIQpxHDPHu/wICBOz4PLcLOQixD64z3P6sUfwTF5eXm7Xrl0bN2/evMmBBx7YuFq1agdkZWVV2WeffXLgZ1esWDGH5zh4no1wyu3evXvbL7/8wmMrzrfu2rUrOIe/eePGjStXrFixZP78+d+//fbbSxYvXryFr0SOX+DHHvyP9/SMSETfkwUgFOZUGAp7pqz8J0IwvSKEanyTECRCFg75PA+ue/Xq1aBLly5t69Wr17xGjRqNqlSp0rBy5cp1fv31Vys4ly9f/tft27f/uHnz5mXr169fumrVqvmTJ0+e8corryyHTCTFLuPQtQhkEkYaRppExMHrZdtZybg0g9QkhgghbSHtIBLQ3xdH4J9xxhn1evTo0fbggw8+pnbt2q1BhgPDkHaQZsVPP/305cKFC/9v4sSJM955551VkGsnDhJGvsgTq11EFialzBOlLBNExJBfEClICB2VBg0a1OL000/vdsABB7TLyclpzFIUdrd169YlK1eu/Oy9996bNHLkyLmQdwcOEkVHQWQRQeSHPalJl68sEkSEkC9iqA0hLVEJaAdH9+7d6/fp06fbQQcd1BlmU17Sc8FhgDDHFn/33Xfvjhs3btKbb775A6ImWXRIu5hmWEFtFYdSpy6qskQQEYJoy5SSCUVyUEtESdGsWbPqQ4YM6XzEEUd02X///dugHcF3Msah/bLn559//uI///nP5OHDh7+7YMGCDUiciCINE0sUkoWuzGiUskIQkYO+qTFMbVEZ/1U+8sgja91yyy0XHnbYYeehZ6kGS0OmO/SWrZ83b97LQ4cO/eesWbPWIL3bI4eIQhNMbZVYjZLR8GQ6QWKJQXKo90kag8TIPuWUU+oOHjz44kMPPfQcdLdWyehcLyBx6FLe/M0337w2YsSIsR9++OFqPLYNB8kSSxQ15KVJ6Geky2SCiBwyp9TGIDECbQE/+8wzz2x4xRVX/HfTpk3PqlChAu+Xebdnz57tixYtemP06NHPvfXWW8sAiIhCsrCdItMrligZh10mEkTEoG+aU6bGyMGgXfVRo0Zd1qJFiz6wx/mfdzEIoN21c+7cueMGDhz4FAYn2UbZisPUKBlvdmUaQUQOU2uwncHGd2BKwc+59957T+3cufOQ7Ozs+rj2rggEtm3b9gPGUh76y1/+8gEeJUmkUWh6qX2SkdqEvTiZ4KQt5DNd0hg5OM/FURWDegc9/vjjdx1zzDEDMM2jWiYk3EUaiBU6LTpjpsBh69atQ4fXAmoRVkJmBWu2Q8z7LkS0FkcmJIRp0MFMUyNcWiOnevXqVceMGXNpy5YtL0U7I5jvZA3RDA8Y7ZNtc+bMeWbAgAHPbNiwYROSa5pdpjbJiAZ8umsQEYM+02KaU4HWwCDfQSDHiCZNmnRHW4P/e1cKBIgh5pode95557VbvXr1LPR6UZsQ/1hnapTY/9LmOp0JInKYWkPtDHbTVkNbo9OVV145Mjc3t3Ha5EiaCIp5Z/VOPfXUbo0bN14+ZcqUlRDbJElGkINZYSYqTbImENMkh6k52N7IwZTy6v/4xz8Gwm6+yNZM2nQCy6as0Ci/YpBxfN++fUdhKr56umh2qQHPWcPm4KJNcZIedjpqEJMcmiLCdgVNqiowqQ5+4oknRjZo0KATrtO1Akh6RlsMsDym4rSCydUeJtdXMLlIDuEuTSLfohh2gk43ghB4mlSUO5YcVa+99tq211xzzePepLJTWAoLFSZXXZhcXYH93OnTp/9sPEtyeIIYgNg6FTnU5mAvFTUH2xtVMY/otIsuumg45k9VtSWAD7dwBDBFp/JRRx11OpYCLP73v/+9IvK0yJGWREkXDRJLDo5xsEEe9FQ9+uij53Tr1u1udOGSNN6lEAH2cqHtd9rhhx/+E5YEL4YoIobpp1DCxKJOB4KQHDxizaqgpwrrGvqddNJJ1+F/mlzehQABkKQi1s6c3L59+10TJkyYFxHJJIjOQyBt4SKw4IXZiRyxZhU1R7XXX3/9amyGcHGYE1DWZcPmEmPPPvvsvwGHjTi4wQSnqbCHi/O4Qt+7xYIXVhdLDplV7Mqt6skR1mzLLxcrMOYV8wwHKzaaxsxLanyWP+UzTsPnwmpiCTQCSBkJaLRBTrOqVatWA8IHp5coHgLoBj4S5tZOmFtcD0/zypzYGO+V0NwLI0FEDvqsZTg9ROMcVdkgj7Q5+L93aYJA/fr1j0XjfTUa7osgskwr+SRNKF0YCxllkuYgOaiS1ZXbqWfPnvezpySUaBYiFJa1btqyZcsyjDYvW7t27VJu/oY14Wuwn9WWNWvWbMb1FmzTw0G2cthGiOtVcmvVqlUF+2vlogauxU3natas2QizBBpirKFhOnZnY1bDrldfffV6LGmegmRyouNmHJzLxUmO5og7LsPhwkYQysODmk3kCLpyMQjYrl+/fo+my2zcnTt3rgEBvsTKvJn/+te/Zrz44ovLkSZt1ibfrEFja1FhQV8VBnEJjgsuuKDBH/7wh7ZYCXk0CNR63333rYX/Qu84G/jpp5++6sEHH/wMwpIkbLibJAlVDxfBD4tTgWBhIDk4phE0yDF95JBhw4aNxbqEUG+igP2nlkMLvAs35amnnvoO8rNm1BRwc/UdCSJbXAWiKIIQH5JDZKH5KRM067LLLjsIi8A6Qft0xn5dDfBfaB22UF1/0003XYxth76FkJoyr7lbZqWR8jSEhSAmOVgINEpeFSZFTWx49iRMjZYpRyuOADCdNi5duhQDx/9+G7XiV3iEGa39pWQ6mORQAZDPUEUO+coX0ycxeE3fJAnxYoXCg50ZlaBtj+rYsWPXRo0adYQpFsqFYTAt52ADvv4wOddCZpJE3b+sPISN8MCt1DhlQGpi/z1WZTwz2+yxqo6tM6/FHlW9f380HGc7duz4GQuHxsOenvD9999rTylzp0KRQhluZjozXgcTVFBBUP7Qjz1MohA3aRPiFxAFa2CqDx069FwsFLuoUqVK++N+qBxWJj6PVZ4PQijix/YISUIMhVlBuOARN47Aptop41UTRk0rrudAj9U1EFAFJdWylsP67JUzZswYDZPmjueee+4z1ITrIRQzl7a0ubrO1CKxZDELQEHEYeHQf/R16F36Ohg+D2qs6AHRtqFrdc4bb7wxAabXWuwf3BRmamjmqkGelph1/S3WkyyLpEVpNCsP/JU6F4aCp5qQNaDIUS3S7hiHDK2eOnh+j5mfIfjyyy+fwQKs5zdt2qTeFzYuRQQVUmUyfTOjVRvK/z3wxM6UZ6bPc+FI32yfUJuwJ7AyesGqYieXi1q3bn0pP7uAeyl3aI9sQHukT6Q9wtF2rSUhnsIyZXIK5FQJoIyl9mBGBo1yrCHfDw3dp9DuaJUqwcx4V65cOfWBBx4Yjj581nSmllBtrZrcJIWIIN8MMpnnykP6OkgSYspD7RNWPiRKDvYCa4RlAVdj1u2puE65g6abHdMeIcahMLUIYKqcMlOZKO1RFasBL4f9fGaqBFO8aGesholy6yWXXPLEt99+uxr3ZUqpQclMZE0ngpAMOnDq1JlEFFHpSzb6gZbDoqaNMA+n1qlTZz5Mr9ZoyHOcKWWOa0natm27C981mQUhJK/SYKbLuYypJAhrOZKEMlB7BFNJuDUP1nXck+rBwB9//HE6NkwbhGktcyAbe1nUxlAvVViIAdHyObNAqZDRF1kk9y9Tp05dDrPxXyeccMJBHHzMF4rjC5D1iOXLl09Bw51mVixJKI2ZLmfSsYCmwpnaQ+Rg47HGBx98MAK7ZpycCqEYJ0Z7f/niiy8e792797O4pMagulfvCk0qFjAVOJymTGMw7qKccOZzaqOYvV2slGjWVnn++ecvadOmzR9RMfH/lDh8IeujDh06DEbk7PhQ169MLRLEOUlSpUHMzIqaVuy14qZuKckdRIoG4zqYHkNgn7+JS9ZkIogGsUQOZZbzDCsBNqaMklsEV029G6bkf6BFZuFzDyfqW4kliKtUr+DbK43Rq/UNerWWIiDJRlmVBvmliieRl1NBENZqJAjjZgOSDcdczDWqddtttw3nLn64du7w2bKV991331XYsJmDfTKp2EslcjDDlFnOMyoJgEhm+jxEEvpB2qZNm/YjNoP7tF27diemaq4XthE6Aj1ab6KnkLjLHBTuuOXWpYIgcbUHau4/gSSnuE3+b7Hhq0vfYd/ZP2Hdwre4E0uOdNQaxYHRJEqUMBj83IAv536M8ad2mN9VszgBJfMZVpBHH310+ZdeemkmwjUJQpLQUVZnzjVBTO3BtkegPdDtmIeG+TDYv67lKYcuxjn9+/e/avr06cshj2lSyfZV7eU0YyyXAKWFPg+lMfDxibatn3766VRMhmzDHibLsuwVPAYQWyxZsmQye9vwp0kSyb3XO7ZusDZ36dRoJBHYGGT7IxuDb31BDhLGqaPmwB6zg2fPnr0KEZuaI5PJIYxNctDEYpppUrK3bhMxITbECNdOHcsCywQiZScCywjLCsuMyg9O3TiXBGHi6BgnExxoEH7ZKS8vrwf/cOnY5rj55psHGeTQACALSqxZ5VI0l3GZJGGaRRJiEZCEGBErl0IxLpYJlg2c0spgWWGZUXlVWcItu86lScPEmeQIuhfxua8r0Qd+tN1k5g+dvVVskEfaHDKr4q1JcK7S80vq/EqEkV8O5tY2zLidefzxx3dy2bvF7mYMYpbDOpoZQIHkNSstAuMkb8RIRujCkfkkJXuvKvGDmfgm4LkuIlYcHOcYO3bsjePHj5+PeyKH2VOlwuEkAyRXin0zzTS3ON5DTKhJNhMrYkbscO3M8XuRLCOIkGYWy4zMLGcyuNIgJIapPYJRc6wv749BwfbOUouIZs6cOToyzqE2R1knRzz4zcohOEcX8JrjjjuuHHoaj433go17WD26L9ax74z0aMUbpLURbb4wXWkQESSqPfgdcmwJc14+aSxfcPpInz59nkE0puZQg9ysRS1LEtrgTQzUcI9qEmJHDF1KzzLCsoI4TS3CcuukHeKCIEzIXgQZMmRIZwxG1XAFNiceXnfddXcgvnjkUDdnUFu6kimk8YgkxGQvkhBDYulKdpYRlhXEF48g1knimiDqvaqEKQ1dXIHMeLAy8d7PPvuM3blmbxULgCcHAcrv4pGEnRhbiSGxzP+43atIWSFBzN4sVbxWI3dBECaAiZF5tS8WQ9XHThxtrKbMCHwl1nNgGstHuMU+fk08NHtFvOYw8IqcmiQhVjRFid0WYklMI89Z91hWWGYQEQnitLFumyBiOeOJEgS2bDf0iNiOO8g4rgTkYidcmJrDkyNAp8ifeCQJNAkxJbZFhpCEB1hWWGYQlEkQlh+VryTEEj8IF4VU2oPmVdC9i52/aVM6cVwmG1kJyNqPmcveENO0ciJHGkdCkqg9QuyI4TZiSmxdpStSZtQOYVlihcuyZdXZJogYzniC9segQYNaYFpzntVURQLnBgtcQ45LaQ+zq1C1owtR0jkO4USSUPOKJFuxoGw8MXaROJYZlh3E5bQdYpMgJjlkXmVh7TFVpROHhU/jjA0WytIUkmTjG0uSYEoKtlDdRIyTHVlB4UXKDq0QtUNYflXOCnqtVPdtEoSCUXjGQYIEGgQbBbTDuXXHfatuvfXW1xERTQJzMFC9VtZlyLAISBLT1CKm24kxsXaR1kjZkQZhmRJBrEVvkyBiNuMgObLOOOOMetgWs7G11BgBc1M3bAjN0XK1O9Qw51PMbO8SQ0CY5TO1iDGxTiyokj3NssMyhLepQVimRBCWNSvOJkEosKlBsrAhQ1srqYgJlNuBcsdD3GYtR3OAdjMz1msPgFAKJy1CHIkpsd1BrIl5KcIt9quRMhRrYhX7/UQftEUQU3vIvOLszGMSFbAkz3OvXGM7UGak2WulmrAkQZf1d4idSEJMie0OYk3MXYATKUPUHjxMM8uKFrFFEGIlkoggWVgp5mRw8P3335+E+KU9aFqJIJTLu9IjQA1CTIltoEW4eXfpgy06BJSh1nhKJhbLlspZ0S+X4AlbBJHQDD8gSK9evRpg+eYBJZAxoVf4CYKHHnqIG5CRIKzhfNsjIQSLfFgamCQhtoEW4c72xL7It0v5AMrQgSxLCCYjNEiUIF26dHHS/uD3OQBeLDlkGpQye/zrEQSEZz6SRLC3DlKkLMUSxEq8tjQIhaUWYfg89sE6gubwrTt+vAaRqGEu00oZaj3+MhKB8JSpRS2yM4K9dQjQ3dsMkZAgKl8sa1acLYLEmlgV8SGcRlZSYATKz54ZX3ai+hdBjKf8aRIREEECU4vYMw+SGH7coLC5eWP8QdOdB8uwyhtOk+tsEYRSSoMECcFUgYbJFX3v0PhNQNxlbcZD5FBtt/cL/k5pEBCuIkmAeyQPShNuke9GylIsQYp8ryQP2CCI2BwlSF5eXi4aV3VKImAi7/CDmXhe5PAESQS8xJ+NJQjx3hXJg8RDS+ANliWWKbwSq0FY5pLqbBCEAuYjSdeuXRtjynLShY9FAjbwZ7hHdc+DNRsz0Tu7CBBjYh3gzi/62o0OmYqyxDKFeEzzykr5skEQCcqweVTEuuIm8K06fof85Zdf/gGRsCbz2sMq2tHA99Ii/Nw18yL6hKWTSJmSBlE5VtlLWqwKOGkBRgKioDwCkqAHi2y36rZs2bIMEZAYpvZgBnpnFwGTJMR+dyQvrMYaKVNB+UJEKm9Jj9MJQdCDZX2AEJubkSAih2leeZIkvdhEAxS29Il5YGpF8iL6kI2TSJlKW4IQE7G6AnYJt/6JL6xNWIo4mUHUIqrVlIG45Z0lBEysA9M2kheWovst2EiZIkFUzqzEZ0ODSOCoj61buM2oVYdp10sQgchhahCr8frAAwSkQejvjuSFVWgiZSpaxhCZzpMarw2CmAJS6AouCIINzbhoR2petZopiz+3h4DwDvCP5IW92BBypExJg1iLyyZBxOjyLjY9ht27FSgpowQYr72zi4CJcYB/JC+sxhopU9EyZisyWwSh4HSB70KDrFmzhjsmiiBmpgWC+B/rCESxj+SF1QiNMpWvrCU7UlsEMeUsj8RkmzdsnP/www+xGsSTxAbQ8cMU1gFJInkR/8kk3Y2UKZEjSaHuHYxNgkSFd2Fi4TsW3DVRThmma+/bQ0BYy+c3Rcy8sBJzuptYJij4Fkp5m0QM4nIxlcVMlD9PLQL4NIL1MsUUuojkV2xRyQVMVh02OK4aiYCaK6q9rEbqAycCwlp+OeyCyImEVt2ePXs4KdW6s0mQqMpFYrj1jlWHD9CTINFMijm3GrcPPIo78S9fv3596+NeqHRJEJaxaDmzkQ82CUJ5gwSAIFzhZ9XVqlWLo/VBBkV8xmcShtfe2UMgin0kL+zFhJAjGkTkkJ/0OG0RJCBGRFqaWNY1SI0aNahBmB5lVNLB8gHGRcCshALskRfWTaxImcpXzuJKV8qbtggisYIEuGiDYPJaNUTK9HiSCH13viqlAH98z4Mf3rTqsLR3PSIQQehbcbYIIsGDqQfYAXytFemNQGvWrFkXl54gBiYOT0kQVUwVXSxvwH7AJIjm3KUVQSRslCTYL+lH25lVt27dgxGHFtCoRqPvnV0ETKwD/FFZNbIbJfZ12rFjHeJgGTNJorKXtOidaBDMzVmdNIkLCGi//fZrir+YQZ4kBWBk4bYqIPrS3vvA2rVOECzKWoM4g+n18FUZJz2JtghCQSX0nnXr1lknSG5ubmPUXPwCkUiizEs6aD7AfAhIg7AsBZu5IS8a5nvCwsXq1asXI1hqD2kQC7H8xvpkByxi0A8SsGrVKutfIcJofdZ5551XkBZJdhp9eL8hYJIjqJiQB/UxT8r6Arm5c+d+BxGkQUQSlrmkOlsaJEoOSLv7q6++WpZUqQsIrFWrVofiL3NrfFvpK0CCMnlb5hW1xz6dO3e2/oEkVIa7X3nllUWITwRRpZz0DLBZgESS3a+99toqF9+POOSQQ/h5hSCj4LNGUw1H37vkIiBsWYZk1mY1bdr06ORGs3doaH9g0eIKjq0FFgp8EYR+Up0NgpjCKgG70VCnSrTqsGdr++zsbLZDRBKmTxlpNe4yGLhwFUGoubMwBsLPE1h1KEvfIwJqD1ODWInTBkEoqEhCgjARv2Ah/7f8w6bLysrab/DgwUchDvP7EbbSaDMp6RK2yMEKKevSSy89GJspWB8kRKcPK9tgiyH4qoSTrj2YCTYLDwWOEgSLaBYwQtuuffv2pyCOeB969GZW8sCPpz32xfcDOyYvioJDQlkiQVjx8lBlXPALpfjHGUHw0fmvSyFnsV9t2LDhCXiYZpZIwjTy8AQBCElyJkEC7YFw90Ub8IwkhV9oMOj0oTUSbw+0Qt8ryZ+2CCJWRzUItsZfiIY6pwdYdfgSaqP+/fs3QyQkiEwtkUO+VRkyPHBhyLIjclS69tprWwP7BrbTvmvXrrXPPffcQsRjmliMlmUu6c4WQSioSBKoQiRs108//cTPE1h3PXv2PB+RmFqEvSxeiyQPeWJJTEkQVkSVOnXq1A2+dYcBwhksS4jIJIgVcjAxtggicqgBxcTsWrx4sfWdv5moJk2a/OH444+vg1OSRFpEaVUNyEe9SwwBYsdDBCG2lWDWVsOCtY6JBVWyp+fNmzcdb7I8iSAqa1ZIokJTMmmLfotCU4MEBHn77bf/t+hXSv8EBpIqDxo0qBdCqozDt0VKD6lCEDlYbkiOQHv89a9/7YnRcy151rM2/N3PPPPMNARMDcJyxQrYCjEQbuBsEkTMjrZDMPq5HFPff1DkNv3DDz/8nDp16nDhTixJGK3XIomDL8xYZtT2qIyp7VVbtmx5UeLBJf7G+vXr537xxRdsx8rEEkGskcQmQYgABWciAg0CfydGQD+Bb91hTGT/O++8k3axCMIaz7dFSo68tAcxJJY0XysPHTr0nEqVKu1f8mCL/+aSJUtogTj9QKtNgkiD0JeZtXPq1KnvFh+S0j153HHH9Yd9XAOhcOM609RiZqtGLF0kZeNt4SXtQSwrY/Z01TZt2vR2BcHHH3/MypUEUftDGsSaCDYJQqGlQZgQqsVd+OD8bFdmFr5lV3f48OGXIl4SRJqE5gHTrUzHqXeFICCcRA5qD2KZM2rUqP8Cxta//ULZsMT2x0ceeWQeTp2ZV4zXNkEYhzQItQjZv/P777+fwj9cOOyXdeE555zTBHGRJOrVKsumllngmf/xDj0jn8/ItCI5svGNwIatW7e+DOdOHHpAJyMi7q8mgrA8sWxZdbYJwgRIi6gdsuOtt956x2qqjMAjPVqDcYsNdpGkrGoRs8Cr0BMLHao4+J+epc9rPhOYVvBzrrvuumuw/af1/a8QVzlOb3/66adfxanT9gfjtk0QxkEnLUL278So+oJNmzZRXTpx9erV64AG+4mIjBlaVk0tFXgRg6ZS0E0bwYTalddmZ4aeFTlYweQOGzasA2ZOd8C5E4fBwU8nTpy4HJFJgzjRHkycC4LEahHWAjtmzpz5MgVw5c4999xbTjzxxPqIryySxCSHCnvQjgAe1KxcAUjfxIZE4bP5nj/22GPrwry6HveduWnTplF7cP2HzCs1zlm2rDoC58KpJmINxUyohl1IauOb2pMwPbqmCwEYB75b8XmHDh3+hJkKG3DJTxVvxaFeEWegI06XLpYcLPhBFy194J/Vtm3b3K+//nobliSwhtbBwkhMaHaRTCRR9Y8++mgkxpeOx7kThw6dFZCvB/KMW0dtxLENB/OMWoTyWXUuNAgToHYIE0Xgd0Jtbvnmm29e55+uHLbEPHbcuHEDEJ9ZW5omhQqTK5FcxKM0mY3sXFRQ+02ePPlGzIyd8eSTT/4fCv7HmOlwAwjDDfhMjcIKLdAy48ePv9QlOQjOggULXgc5qD1UkYkY1rUH43dJEJGEjXUmdvtjjz32Mj5bQMI4c0cddVS/m2++mTUgC4Ea7SQJsVBhop8JTukgOWQqMc1VXnzxxXvz8vL64ysCwRQRTBWpieWyl4MkQ/F/dRy8Hz1uuOGG9ui1YuXizKFs7ETX7muIkFrNJAjLUkYRRKBSJbIGYGJ3vP/++yuWLl36rv504QP0ihdccMHdOJohPhYA1pBm928mkYRpkXnLSoCmUu7f//73Hui46IrzvRwmHZ6D8Y2z8AcHWIMDs6Ob9+7d+x70JpFkzhxGzt/55JNPfkSEJIjaH87IwYS60iCMSwkjQaJaBJk1hjUFH3Dl2O656aabRp155pl5iJOahCRh4WEhYiHIBJIoDcxjpomVQHazZs1qnnDCCYNwXqA7+eST/4w5VnXxwH7o2Gh6yy23PATM9ivwBQt/8JMZI0eOHI2gaV6RICwzrGCttzsQR9RR9bp0zDQ6+sy4CrAxd3br1q0OdkZswT9cOe7dhMw/AY3Tj6DFmAkisBPVbTmdIofZ7mAlUBXtjYHQHjQxC3TAJheTPbNmz569csyYMXdXqVKlQYEPW/pj/vz5zw8dOvQ9BM+Ps5oNc+WTpZjzB+uaIIw9liQVMYFxMboOe0KFswZ35jChsXrHjh3bff755x9icztpMWVAOhOFlQ9xZv6y5zBod1x44YXNYS7dDpyLzHeMcxyCNeatMd+qCd536tAoX/fnP//5RnxvfR0iZk+jTCxqD6f54tLEIsgqfExo1MzCBMaV0CSv8AHXDrXjIaNHj34Y2qQR4labROYWC5IKm4jtWsRE45OclJumlQiSc+WVVw4BOXhdpEPjnVv45BX5oIUHMEb27Jw5c9ita/ZeiRxOCVJkTWIh/QxSmUifRwV0+S7s0aPHma6mL1AIOUy4q40dATuhLfQVMmc97jMTmCFmpjjNGMlWAp/EEDnY7qBpVQWLmk475phj+pcgPKevYNxjeZ8+fW6HzzEPaQ9Wpmy7Os8DAunaMZEqgFEtgl1PfoYmGelaGMWHNQ31Bg4c+MQDDzxwGu6ZjXZWIiKyHg+rLzlNglTGmEdVVABXh1VoUy5MaX8MA7ocxFW7g2WEFRWdc4IQ0FQ4ZSQLH1V+0ICEXwPTCh7DgF7bVAjFOGGC7Ebj9EFswvwELjVySxtYA1R8LIxOmJIcbMsF7Q74NTDmceWRRx55RRiFNmXCSP5X2EugH+5Ri5skkfZwTpBUaBBiooSyZpAWYY2xFX3w98HUYYFMieM4CZaQ3oDINTZCjHikqjJJBAfKyEqHBAm6ddHQboAp/30TCSQVz+IzfVtHjBhxJ+KmWZXytocwSBVBGD9JwoMk4SAQSbEVtd23qMGfxXmqncZEZGKlWp7C4je1hxrm7GjgtPTBqWjXFSZsvP8wIDjipZde+g7/saJMWa9VrGxhIYi0CGuOrdjj9Uks0J8dK6zjaxa0dNIclDWf9sCUmmMxMt7JMW4JR4d5eR/98Y9/fBUvbsFBgrDLXSatKlLccu9SSRCmVomXqcWaYxu+abj5/vvvvxVql3ZoqhyxEUFUQ6dKlsLilWyUNao9sMthLlZSXguTkf+H1mEp7drbbrttKAQ0yaGGucpHyuRPNUGYcJlZrDFoagVaZMKECYswV+t+PpAip4IX6gIGbCSnqT1yMIXnfI7xpAi7YkeLGcXDPvzwwxV4QW0PlgFTexQ7LBsPhoUgIolMLarZLeh2fWvZsmWTbCQ8Q8I0yUHtETTMscN9XSxsujzsacRkxImYJfw+5CQ5mOckR2i0B2QJTAj6YXAmSQJTC0JtwUbUw7A8d34YBAyZDCIHKzlqD3aXBw3zO+644yo0zDllPbRuw4YNXw8YMOA+CMi5ViQI2x3SHik3rSBL4MKgQSiIAGFbxDS1tqCWoY06BLbqT4HE/kcIiCCmaZV91VVXtczLy+uuh8Lob9++fQV6165m3kI+kkO9Vsx7lYVQiB4WghAMAaMGO2sUtke2wE5dij1Zr0ODk9fe5W93qGHOgcEcTNNgw5ykCaXjtyox1nU1VjAuh4ChbJibwIWJIJQrliQytTb/7W9/+wJr2O/GSDefKesuVnvQtMp+9NFHu2PZQKuwggPi7nrhhRduxBY+X0NGcxp7qNodJn5hIwhlE0mobgkcSUI1vBmN9kmYmp6y+VqQIQzOJIe0R+XDDjus5kknnfSnMAgYTwZWbB988ME9WOMxDf+LHMxb5nHoTCulIcwEIVHUHiGQVMebYEI8N2vWrNFKQBnzRQ7mW76G+b333jsAq/5qhxUPzI4Yg+n2r0M+jm2xwqO5HLpGOWTK58JIEAooLbJXewT/bcJ68jH4kMqzfLCMOZMgnAoTdOtivfghhx566PlhxQKrA8di8icrtXjkYB4rv0OXhLAShEAJtL16tvDfRowSj1q4cOE/Q4eoPYFIDjrmWdS0wnnOFVdccQ1MGBImVI5mFZYxPHr22WcPh2AkB60Aag52wIS23QHZoi7MBKGQIonaIwQ2GESEvxGbLjwwd+7cp/hgGXAkCPMrX7fufffdd1rt2rXbhy39IMdurO14AMt8n4RsseRgfoZacwjPsBOEcookprkVJQnWWD8yffr0+5khSlQG+vFMq8r169evdvrppxe6Q0kqsGBv1aRJk+7CIO+LiJ8N8tB35xaEUzoQhLKTJCRILEkI/sZ+/fqNx1jJzcgYNuYzzZnkoGmltkfOQw89dEl2dnb9MCWY2/WMHTv29iFDhrwLuUgMNchNs0raI0yix5UlXQhC4QslyeDBg9/G1pgDuSNG3JSm902ZVyRI0DDv3r17o1atWl0ctmRhnONh7P4+A3KxstJhzrFKG3IQ23QiCOUVSWhOsZGn0fZAk9x9993TsAbiYszzmcuHM8SJHGbbI+fqq68ejJ1HOHoeKocls2wPqY1h+jKV6aeNSzeCEFgBHUsSqvONb7zxxndnnXXWZfgi0YS0yYWCBY01rwLtceutt7bDzoenFfxa6v7BN+pPuv766zmaL9lNYdKKHBQ8HQlCuUWS2DYJSbIJK9TWdunS5W6M3N4Fm5gN+nR1KmTMp6Brt3r16jnoNr0mzAk6//zzB1arVo2zi6n1KHu6lrP0FRygx5KEdi772AOSwN+A8YGX77rrrt7r1q2bhet0dTKxggY65lv1zM3NPTjMicFCrYMefvjhsyEjZSZJRHT6aeXSltkRlEUS+jS5SBI2DIO5W/A3otE4D5sxX8Y5XOjlIoHSzYkgzKuKLVq06JUOCcDevpxyb2qQtCMHcU53gjANJklocokkNK2Cxjt6ttZffPHFT91zzz19sBlEcbWJGS7jSbULamHsAtko1YIUJ35ouTw8F8hcnOfD+kwmEITYsjCTHDqoTdTDFTW58HWpuViO2m/KlCm379ixYzWeKcypB6awZ1z+x7TtxmKjZS4jLWlcWOC2hvLioNzMn7R0mUIQga9aPyhMuCltIpNrA+6tx87hr2IcoSenqXBgSy/H+HxXhFO4MY84uRT5AxMS35if6CTWUkayaNGilxEEMaTcqcSvVCnJNIIQDBUokcQcLyFROC9oA74JshrTVEbeeOONvXD+Bu5R45jOHPllmKlyjJuFjOnY0bdv3yfxWYC3UiVMceJFL+LEyy+//GnKi4NyiyTFeT1Uz6RlwykBBGUD02dlwCPoDYKvTQ64Gq9Sr169DkCvV19stHYurrObN2/eBD4JxbYMycJM5uHSSW42djnFJFg5CD8H+4Ydj69FHQdbvzb2DwsqOnRCJJSf5vN5v61j37ly5crpMONYiXCf4iIrBj2DTSL2wGzdgF36p2EQ8yO8LuyooaVJWGkVGSaeCY1LCNDQSJ24IEynDvWsmEQhWXhdAesWamDaSl98pmwYrjVVQrUgM9ilk8wkgEhCWTlgSF9y8z89i9NiOT0f+O+8887/4KOqL0ycOJGbY7AQm0dhAeo5aTmZtcSOFYtJDtf4FSZ3sf4jOGXFqUAwvSxwKnQkBg8RhxnOjCQpmLkih+7jllMnuSWviCKZJXciealnFbaulTAVevp08n+72vtX2EjLEjMdvCfNUVQ4e4ec4juxwKRYHCfRm4WC5yKLfAphZjgzN9UZLJkpo2Q2iaH/KXtxHJ+ni/V/u/u79jCvdR7PJ146hBeJIRz1X7x3Q31PAIVaSEvCqVDF+orOzFzeS3UmS07KonP5ukc/Ecf36eTznOmUM891L56v54SRfD5rnsd7N9T3TGBCLahF4cxCFi8aM/Pj/e/6nvJMfkniT+RdpT+RePSO/ETe9c96BDwCHgGPgEfAI+AR8Ah4BDwCHgGPgEfAI+AR8Ah4BDwCHgGPgEfAI+AR8Ah4BDwCHgGPgEfAI+AR8Ah4BDwCHgGPgEfAI+AR8Ah4BDwCHgGPgEfAI+AR8Ah4BDwCHgGPgEfAI+AR8Ah4BDwCHgGPgEfAI+AR8Ah4BDwCHgGPgEfAI+AR8Ah4BDwCHgGPgEfAI+AR8Ah4BDwCHgHbCPw/+33sERcUNPgAAAAASUVORK5CYII="})`,
  backgroundImage: `url(${"data:image/png;base64,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"})`
};

let canvasScale = 1;
const SCALE_FACTOR = 1.06;
// var canvasInstance=null;

export const CanvasContainer = createReactClass({
  getInitialState: function() {
    return { videoList: [], rnd: [] };
  },

  componentWillMount() {
    this.rnd = [];
  },
 
  handleClick(indexToFront, e) {
    if (this.props.activeObjectIndex !== indexToFront) {
      this.props.setActiveObject(indexToFront);
    }
    // let that = this;
    // this.rnd.map((item, index) => {
    //   if (item) {
    //     if (index == indexToFront) return;
    //     this.rnd[index].updateZIndex(0);
    //   }
    // });
    //this.rnd[indexToFront].updateZIndex(this.rnd.length + 1);
  },
  setObject: object => {
    switch (object.type) {
      case "video":
        return <VideoPlayer {...object} />;
      case "img":
        return <ImageComponent {...object} />;
      case "rect":
        return <Rectangle {...object} />;
      case "text":
        return <TextComponent {...object} />;
      case "circle":
        return <Circle {...object} />;
      case "triangle":
        return <Triangle {...object} />;
      case "star":
        return <Star {...object} />;
      case "textThreeTemplate":
        return <TextThreeTemplate {...object} />;
      case "textSideTemplate":
        return <TextSideTemplate {...object} />;
      case "textTwoTemplate":
        return <TextTwoTemplate {...object} />;
      case "halfArc":
        return <HalfArc {...object} />;
      case "meme":
        return <Meme {...object} />;
      default:
        return <Rectangle {...object} />;
    }
  },
  onResize: function(event, dir, refToElement, delta, position) {
    this.setState({
      isResizing: true,
      resizingWidth: refToElement.offsetWidth,
      resizingHeight: refToElement.offsetHeight
    });
  },
  render: function() {
   // this.loadAndRender();
    return (
      <div>
        {this.props.videoList.map((item, index) => {
          return (
            <div>
              {!item.isDeleted && (
                <Rnd
                  key={index}
                  style={style}
                  default={{
                    width: item.position.width || 200,
                    height: item.position.height || 200,
                    x: item.position.x,
                    y: item.position.y,
                    degree: 0
                  }}
                  ref={c => {
                    this.rnd[index] = c;
                  }}
                  className={"rnd-resizable1"}
                  resizeHandleClasses={{
                    topLeft: "resize-handle-base-class",
                    topRight: "resize-handle-base-class",
                    bottomRight: "resize-handle-base-class",
                    bottomLeft: "resize-handle-base-class",
                    top: "resize-handle-base-class",
                    right: "resize-handle-base-class",
                    bottom: "resize-handle-base-class",
                    left: "resize-handle-base-class",
                    rotate: "resize-handle-base-class"
                  }}
                  onResizeStart={e => {
                    this.handleClick(index, e);
                  }}
                  onDragStart={e => {
                    this.handleClick(index, e);
                  }}
                  onResizeStop={(e, dir, refEl, delta, position) => {
                    this.props.updateObjectPosition(index,{
                      x: position.x,
                      y: position.y,
                      height: delta.newHeight,
                      width: delta.newWidth
                    });
                    this.setState({ isResizing: false });
                  }}
                  onResize={this.onResize}
                  z={index + 1}
                  onDrag={() => this.setState({})}
                  onDragStop={(node, delta, y) => {
                    this.props.updateObjectPosition(index,{
                      x: delta.x,
                      y: delta.y,
                      height: delta.newHeight,
                      width: delta.newWidth
                    });
                  }}
                  resizeHandleStyles={{
                    topLeft: handleTopLeftStyles,
                    topRight: handleTopRightStyles,
                    bottomRight: handleBottomRightStyles,
                    bottomLeft: handleBottomLeftStyles,
                    top: handleTopCenterStyles,
                    right: handleRightCenterStyles,
                    bottom: handleBottomCenterStyles,
                    left: handleLeftCenterStyles,
                    rotate: handleRotateStyles
                  }}
                  enableResizing={{
                    bottom: this.props.activeObjectIndex === index,
                    bottomLeft: this.props.activeObjectIndex === index,
                    bottomRight: this.props.activeObjectIndex === index,
                    left: this.props.activeObjectIndex === index,
                    right: this.props.activeObjectIndex === index,
                    top: this.props.activeObjectIndex === index,
                    topLeft: this.props.activeObjectIndex === index,
                    topRight: this.props.activeObjectIndex === index,
                    rotate: this.props.activeObjectIndex === index
                  }}
                >
                  {this.setObject(item)}

                  {this.state.isResizing &&
                  this.props.activeObjectIndex === index ? (
                    <span
                      style={{
                        position: "absolute",
                        top: "-30px",
                        left: "-30px",
                        color: "grey",
                        backgroundColor: "rgb(230,230,230)",
                        borderRadius: "5px",
                        padding: "3px",
                        fontSize: "9px"
                      }}
                    >
                      {this.state.resizingHeight} X {this.state.resizingWidth}{" "}
                    </span>
                  ) : (
                    this.rnd[index] &&
                    this.rnd[index].resizable &&
                    this.props.activeObjectIndex === index && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-30px",
                          left: "-30px",
                          color: "grey",
                          backgroundColor: "rgb(230,230,230)",
                          borderRadius: "5px",
                          padding: "3px",
                          fontSize: "9px"
                        }}
                      >
                        {this.rnd[index].resizable.state.height} x{" "}
                        {this.rnd[index].resizable.state.width}
                      </span>
                    )
                  )}
                </Rnd>
              )}
            </div>
          );
        })}
      </div>
    );
  }
});
