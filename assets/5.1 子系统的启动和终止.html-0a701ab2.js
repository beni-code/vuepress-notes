import{_ as n,p as s,q as a,a1 as e}from"./framework-204010b2.js";const i={},c=e(`<h2 id="_5-1-子系统的启动和终止" tabindex="-1"><a class="header-anchor" href="#_5-1-子系统的启动和终止" aria-hidden="true">#</a> 5.1 子系统的启动和终止</h2><p>游戏引擎是一个复杂软件，由多个互相合作的子系统结合而成。当引擎启动时，必须依次 配置及初始化每个子系统。各子系统间的相互依赖关系，隐含地定义了每个子系统所需的启动次序。</p><p>例如，子系统B依赖于子系统A，那么在启动B之前，必须先启动A。各子系统的终止 通常会采用反向次序，即先终止B，再终止A。</p><h3 id="_5-1-1-c-的静态初始化次序-是不可用的" tabindex="-1"><a class="header-anchor" href="#_5-1-1-c-的静态初始化次序-是不可用的" aria-hidden="true">#</a> 5.1.1 C++的静态初始化次序(是不可用的)</h3><p>由于多数新式游戏引擎皆采用C++为编程语言，我们应考虑一下，C++原生的启动及终止语义是否可做启动及终止引擎子系统之用。在C++中，在调用程序进人点(nain()或Windows下的WinMain())之前，全局对象及静态对象已被构建。然而，我们完全不可预知这些构造丽数的调用次序<a href="%E5%9C%A8GCC%E4%B8%AD%E5%8F%AF%E4%BD%BF%E7%94%A8init_priority()%E5%B1%9E%E6%80%A7%E8%AE%BE%E5%AE%9A%E5%8F%98%E9%87%8F%E7%9A%84%E5%88%9D%E5%A7%8B%E5%8C%96%E6%AC%A1%E5%BA%8F%E3%80%82">^1</a>。在main()或winMain()结束返回之后，会调用全局对象及静态对象的析构丽数，而这些函数的调用次序也是无法预知的。显而易见，此C++行为并不适合用来初始化及终止游戏引擎的子系统。实际上，这对任何含互相依赖全局对象的软件都不适合。</p><p>这实在令人遗憾，因为要实现各主要子系统，例如游戏引擎中的子系统，常见的设计模式是为每个子系统定义单例类(singletonclass)，通常称作管理器(manager)。若C++能给予我们更多控制能力，指明全局或静态实例的构建、析构次序，那么我们就可以把单例定义为全局变量，而不必使用动态内存分配。例如，各子系统可写成以下形式：</p><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token keyword">class</span> <span class="token class-name">RenderManage</span>
<span class="token punctuation">{</span>
<span class="token keyword">public</span> <span class="token operator">:</span>
	<span class="token function">RenderManager</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token punctuation">{</span>
		<span class="token comment">// 启动管理器 …</span>
	<span class="token punctuation">}</span>

	<span class="token operator">~</span><span class="token function">RenderManager</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token punctuation">{</span>
		<span class="token comment">// 终止管理器 …</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// 单例实例</span>
<span class="token keyword">static</span> RenderManager gRenderManager<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可惜，由于没法直接控制构建、析构次序，此方法行不通。</p><h4 id="_5-1-1-1-按需构建" tabindex="-1"><a class="header-anchor" href="#_5-1-1-1-按需构建" aria-hidden="true">#</a> 5.1.1.1 按需构建</h4><p>要应对此问题，可使用一个C++的小技巧：在函数内声明的静态变量并不会于main()之前构建，而是在第一次调用该函数时才构建的。因此，若把全局单例改为静态变量，我们就 可以控制全局单例的构建次序。[^2]</p><p>[^2]:这称作Meyers单例，延续于ScottMeyers的More fectiveC+一。一一译者注</p><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token keyword">class</span> <span class="token class-name">RenderManage</span> 
<span class="token punctuation">{</span>
<span class="token keyword">public</span><span class="token operator">:</span>
    <span class="token comment">// 取得唯一实例 </span>
    <span class="token keyword">static</span> RenderManagerg<span class="token operator">&amp;</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
    <span class="token punctuation">{</span> 
        <span class="token comment">// 此函数中的静态变量将于函数被首次调用时构建 </span>
        <span class="token keyword">static</span> RenderManager sSingleton<span class="token punctuation">;</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),t=[c];function p(l,d){return s(),a("div",null,t)}const r=n(i,[["render",p],["__file","5.1 子系统的启动和终止.html.vue"]]);export{r as default};
