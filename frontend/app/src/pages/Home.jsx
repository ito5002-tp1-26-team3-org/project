import { Link } from "react-router-dom";


export default function Home() {
return (
<div>
<h1>E-Waste Management Tool (Iteration 1 MVP)</h1>
<ul>
<li><Link to="/resident">Resident Portal: Disposal Finder</Link></li>
<li><Link to="/staff">Council Staff: Login</Link></li>
</ul>
<p>No styling yet — functional MVP only.</p>
</div>
);
}