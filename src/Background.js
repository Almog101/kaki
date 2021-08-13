function ColorBox({color, left, top}) {
  return (
        <div className="box" style={{backgroundColor: color, left: left, top:top}}></div>
  );
}

function Background() {
  const colors = ["#e6686c","#a4ca7b","#009bd4", "#f9cd61"];

  return (
      <div id="background">
        <ColorBox color={colors[0]} left={"0%"} top={"0%"}/>
        <ColorBox color={colors[1]} left={"50%"} top={"0%"}/>
        <ColorBox color={colors[2]} left={"0%"} top={"50%"}/>
        <ColorBox color={colors[3]} left={"50%"} top={"50%"}/>
      </div>
  );
}

export default Background;
