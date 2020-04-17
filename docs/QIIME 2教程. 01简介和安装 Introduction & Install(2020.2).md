[TOC]

## 写在前面

QIIME是微生物组领域最广泛使用的分析流程，10年来引用近20000次，[2019年Nature杂志评为近70年来人体菌群研究的25个里程碑事件——里程碑16：生物信息学工具助力菌群测序数据分](https://mp.weixin.qq.com/s/Y8ciwmNdXqmiAtt3IKVdVA)。为满足当前大数据、可重复分析的需求，北亚利桑那大学Gregory Caporaso教授于2016年起从头开发了QIIME 2，并获得了来自全世界79家单位的112名同行参与，于2018年全面接档QIIME，文章于2019年8月刊正式发表于世界顶级杂志[**Nature Biotechnology**：QIIME 2可重复、交互和扩展的微生物组数据分析平台](https://mp.weixin.qq.com/s/HCfXbJvu3KKS0wfw0NEzZw)

宏基因组团队于2017年6月加入了项目的测试、教程编写及文章投稿全过程，主要负责中文文档的翻译和传播。

- [2017年9月完成了QIIME 2 2017.6版本9节约5万字用户文档的全面翻译和测试工作](http://mp.weixin.qq.com/s/wkn-91BVOSWZLRvlcaaEgg)。发表后受到了大家的欢迎，在公众号、CSDN和官方论坛阅读均阅读过万次。
- [2019年1月完成了QIIME 2 2018.11版本18节约10万字用户文档的全面翻译和测试工作。](https://mp.weixin.qq.com/s/IZLjdkRq2-36DJ9X792_MA)
- [2019年8月文章于Nature Biotechnology正式发表，宏基因组公众号将陆续更新最新2019.7的中文用户文档和配套的视频教程，共22节，十余万字。助力同行快速上手QIIME 2的使用，轻松分析大数据](https://mp.weixin.qq.com/s/UFLNaJtFPH-eyd1bLRiPTQ)。
- 2020年3月，QIIME 2上线半年，引用近500次。推出了最新的QIIME 2 2020.2版本，中文教程也将同步更新。

近一年来，QIIME 2新增了较多功能，如vsearch、时间序列分析、宏基因组和代谢组等众多新插件的加入，预计将来还有宏转录组、宏蛋白组等功能开放，使QIIME 2发现成为多组学分析平台。

QIIME 2文章于2019年7月24日在线发表，于8月2号正式发表于《自然生物技术》，借此之季全面更新2020.2版本官方用户文档中文版，将在宏基因组公众号首发，官方论坛、Github、CSDN和科学网同步更新。

## QIIME 2的优势

1. 易安装：曾经QIIME的安装让无数生信人竞折腰，QIIME 2采用Conda软件包管理器，没有管理员权限也可以轻松安装；同时发布了Docker镜像、VirtualBox虚拟机等下载即可运行；
2. 使用方式多样：支持命令行模式(q2cli)，也支持图型用户界面q2studio；还有Python用户喜欢的Artifact API(类似IPython notebook)；不安装软件也可以在网页中查看和交互探索数据结果图表；
3. 分析可重复：全新定义了文件系统，即包括分析数据、也包括分析过程和结果，每一步的结果均可追溯分析过程，方便检查和重复；
4. 可视化增强：QIIME后发制人，引用量超越早它一年发表的mothur，就是其可视化方面的优势，现可视化结果更加多样、美观，采用全新可交互式图形系统，探索数据更方便；
5. 方便合作：项目很少一个人可以完成，多人多地结果图表方便共享，适合当下科研多人合作的需求；
6. 可扩展：QIIME 2不再是一个软件，更是一个平台，支持自定义功能并定制分析流程；高手可以自己写插件，加入QIIME2的流程中了；
7. 社区优势：目前已经有100多位作者参与本项目，有新功能想要增强QIIME 2的小伙伴，赶快行动为QIIME 2添砖加瓦吧！
8. **中文教程支持：在宏基因组公众号、QIIME 2官方论坛、CSDN和科学网会更新中文教程，而且配有视频讲解，还有QIIME 2专题微信群(扫码文末添加主编好友，务必备注“姓名-单位-研究方向-职务/年级-QIIME2”方可入群**)。


# QIIME 2用户文档(版本:2020.2)

https://docs.qiime2.org/2020.2/

正文共：8575 字 1 图 2 视频

预计阅读时间： 20 分钟，视频 21 + 27 分钟

更新时间：2020年3月2日

![image](http://210.75.224.110/markdown/qiime2/fig/2019.7.1.01.jpg)


### 视频：QIIME 2用户文档01.1 简介

https://v.qq.com/x/page/r0910dnzmof.html

视频有广告，清晰度不够高吗？**后台回复“qiime2”获得1080p视频、测试数据下载链接**。


## 入门指南

**Getting started**

https://docs.qiime2.org/2020.2/getting-started/

微生物组(目前以扩增子16S为主)分析是一个即复杂又成熟的领域。复杂是指它的分析种类、方法、步骤特别多，初学者会感到压迫感，但只要肯花几天时间还是可以轻松上手的，再经过几个月的练习和实践，很快很成为领域内的技术小达人，相对于国内5-8年的硕博生涯，如果课题涉及扩增子分析，还是值得投入时间学习的。

本指南将帮助你学习必备的知识，来完成理解、安装和使用QIIME 2，并实现分析你自己的微生物组数据。

下面是学习的顺序：

1. 先熟悉QIIME2的[核心概念](https://docs.qiime2.org/2020.2/concepts/)；
2. [安装QIIME2](https://docs.qiime2.org/2020.2/install/)；
3. 通篇跟着[QIIME2教程](https://docs.qiime2.org/2020.2/tutorials/)完成微生物组分析。推荐先学习[概述(grand overview)](https://docs.qiime2.org/2020.2/tutorials/overview/)和[人体微生物组(Moving Pictures)](https://docs.qiime2.org/2020.2/tutorials/moving-pictures/)的教程，接下来再学习[粪菌移植(FMT study)](https://docs.qiime2.org/2020.2/tutorials/fmt/)和[沙漠土壤(Atacama Desert soils)](https://docs.qiime2.org/2020.2/tutorials/atacama-soils/)分析教程。
4. 最后可以尝试不同的工作界面，QIIME 2运行多种用户界面，之前你使用的是q2cli的命令行模型。可以查看interfaces文档了解不同的工作界面。例如，喜欢使用图型界面的用户，可以使用QIIME2 Studio；喜欢Python3 Jupyter Notebook的用户可选Artifact API界面。

## 什么是QIIME 2？

**What is QIIME 2?**

https://docs.qiime2.org/2020.2/about/

QIIME 2是一款强大、可扩展和去中心化的微生物组分析平台，强调数据分析透明。QIIME 2可以使研究者从原始DNA序列开始分析，直接获取出版级的统计和图片结果。

主要特点：

- 整合分析流程、自动化追踪数据来源
- 语义类型系统，自动识别输入文件类型
- 插件系统可扩展微生物分析功能种类
- 支持多种用户界面，如API、命令行、图形界面

QIIME 2是对QIIME 1完全重新设计并重写的微生物组分析流程。QIIME 2保留了QIIME 1强大和广泛使用的优点，同时改进了其众多不足之处。

QIIME 2当前支持从头到尾的完整微生物组分析流程。通常QIIME 2插件功能，不断有新功能可用。可以在可用插件列表中查找当前[可用的插件](https://docs.qiime2.org/2020.2/plugins/available/)。在[未来可用插件页](https://docs.qiime2.org/2020.2/plugins/future/)列出了正在开发的插件。

## 核心概念

**Core concepts**

https://docs.qiime2.org/2020.2/concepts/

基本概念的学习信息量较大，有基础的同行可直接跳过本章，进行下面的软件安装和接下来的数据分析。学习中有疑问和不懂的词，请返回本章扫清新词和概念的障碍。

想要深入理解QIIME2的分析过程，QIIME定义的核心概念需要了解一下。

### 数据文件: QIIME 2对象/文件格式

**Data files: QIIME 2 artifacts**

>详者注：QIIME2为了使分析流程标准化，分析过程可重复，制定了统一的分析过程文件格式`.qza`；qza文件类似于一个封闭的文件格式(本质上是个标准格式的压缩包)，里面包括原始数据、分析的过程和结果；这样保证了文件格式的标准，同时可以追溯每一步的分析，以及图表的绘制参数。这一方案为实现可重复分析提供了基础。比如文章投稿，同时提供分析过程的文件，方便同行学习、重复结果分析以及结果的再利用。

由QIIME 2产生的数据类型，叫QIIME 2对象(artifacts)，通常包括数据和元数据/样本信息(metadata)。元数据描述数据，包括类型、格式和它如何产生。典型的扩展名为`.qza`。

QIIME 2采用对象代替原始数据文件(如fasta文件)，因此分析者必须导入数据来创建QIIME 2对象。虽然典型的分析是从原始数据开始导入QIIME 2，但你可以在分析的任何步骤导入数据为对象。QIIME 2也有工具可以从QIIME2文件中导出数据，详见[导出(importing)章节](https://docs.qiime2.org/2020.2/tutorials/importing/)。

使用QIIME2对象代替简单的数据，可以自动追踪文件类型、格式和分析过程。使用QIIME 2文件，研究者可以专注于分析，而无需考虑过程中的各种数据类型。

QIIME2对象可以查看之前的分析过程，每步使用的输入数据。这种自动化、整合和去中心化的数据追溯，可以使研究者保存QIIME2跟踪、发送给合作者、准确知道它的分析步骤。这样使分析过程可重复，可学习，也可以产生在方法中使用的文本和图表。追溯支持和鼓励使用适合的属性产生QIIME2对象(如FastTree构建系统发生树).

> 注意：我们已经注意到使用`artifact(对象)`一词可能产生混淆，因为生物学家通常理解的意思为`实验偏差的来源`。我们这里`artifact`的意思是指被多步处理的对象，有点像考古学中的文物。在我们的文档和其它教程中，我们要清楚这里说明的QIIME2对象(artifact)的含义。

### 数据文件：可视化

**Data files: visualizations**

QIIME2生成的图表结果对象或文件类型，以`.qzv`为扩展名，末尾的`v`代表`visual`；它同`qza`文件类似，包括分析方法和结果，方便追溯图表是如何产生的；唯一与qza不同的，它是分析的终点，即结果的呈现，不会在流程中继续分析。可视化的结果包括统计结果表格、交互式图像、静态图片及其它组合的可视化呈现。这类文件可以使用QIIME2 `qiime tools view`命令查看。

> 提示：不安装QIIME2程序也可在线 https://view.qiime2.org/ 导入文件并显示结果图表，同时可查看数据分析过程；这将方便与不使用QIIME 2的合作者分享结果。

### 语义类型

**Semantic types**

QIIME2每步分析中产生的qza文件，都有相应的语义类型，以便程序识别和分析。例如，分析期望的输入是距离矩阵，QIIME2可以决定那个文件拥有距离矩阵的语言类型，以防上不合理的输入文件进行分析(如一个QIIME2对象代表的是系统发生树)。

语言义型了也帮助用户避免引入不合理的分析过程。例如，一个特征表(feature table)包括有、无的数据(1代表OTU观察到至少1次，0代表没有)。然而，当它作为输入计算有权重的UniFrac时可成功运算，但结果无意义。

了解分析各步的结果，才能对分析有更深入和全面的认识。[语义类型页](https://docs.qiime2.org/2020.2/semantic-types/)查看所有支持的语义类型

### 插件

**Plugins**

QIIME2中的用户的某个特定功能即为插件，你可以安装并完成分析，比如拆分样品的`q2-demux`插件、Alpha-或beta-多样性分析的`q2-diversity`插件等。

插件是软件包，每个人都可以开发。QIIME 2团队已经开完了一套完整的微生物组分析流程，也鼓励第三方工具作为插件来提供额外的分析功能。QIIME 2社区建立了标准化分析插件的开发说明，其他用户按其标准开发的特定分析，并可与团队联系发布，并整合入分析平台。这种去中心化的方法，可以使最新的技术、方法快速部署于QIIME 2平台中，方便QIIME 2用户使用。插件也允许用户为某种特定需求选择、自定义分析流程。

检查可用插件页面，查看当前[可用的插件](https://docs.qiime2.org/2020.2/plugins/available/)。查看[未来插件页](https://docs.qiime2.org/2020.2/plugins/future/)，查看正开发的功能。

### 方法和可视化

**Methods and visualizers**

QIIME 2插件定义的用于进行分析的方法和可视化工具类型。

方法是对QIIME2定义的输入对象进行操作的过程，包括命令和参数，并产生1个或多个标准格式的输出。这一结果可以后续分析或可视化，产生中间或末端的输出。例如`rarefy`方法，输入文件为`q2-feature-table`插件产生的特征表，输出文件为样本深度一致的特征表。它可以作为输入文件，用于alpha多样性分析中的`q2-diversity`方法。输入和输出均为`qza`文件；

可视化工具定义了标准输入，包括QIIME 2对象和参数的组合，产生统计表格或可视化图形，方便用户解读，输入为`qza`格式，输出为`qzv`，文件不仅包括结果，还包括处理的分析命令和参数，方便重复和检查分析过程是否准确。可视化的结果文件qzv是分析的终点，不可以进一步分析。


## 安装QIIME 2

**Installing QIIME 2**

https://docs.qiime2.org/2020.2/install/

有多种安装方法，有Linux服务器的伙伴推荐使用Conda安装，如果还存在兼容性问题可尝试Docker安装解决，想在windows笔记本上体验的朋友可使用Virtualbox虚拟机安装并学习。其它情况根据自己的环境选择以下方法其一即可。

### 视频：QIIME 2用户文档01.2 安装

https://v.qq.com/x/page/v0910kbk3o0.html

视频有广告，清晰度不够高吗？**后台回复“qiime2”获得1080p视频、测试数据下载链接**。

### 原生安装QIIME 2

**Natively installing QIIME 2**

https://docs.qiime2.org/2020.2/install/native/

下面的教程将介绍如何安装 QIIME 2 Core 2020.2 distribution

> 注意：QIIME 2当前不能在Windows环境下运行，我们建议使用[QIIME 2 virtual machines虚拟机方式运行](https://docs.qiime2.org/2020.2/install/virtual/)（译者注：虚拟机效率较低，一般无法运行大数据，只建议学习、开展100样品以内小数据分析体验）。

Miniconda软件包管理器安装(需要有Linux服务器，但无需管理员权限)提供的conda命令，可以快速安装QIIME 2程序和相关插件。

本人测试采用Miniconda2安装QIIME 2 2019.7于18.04.3 LTS(64-bit)，当然，你也可以是其它的Linux发行版如CentOS 7，或macOS 64-bit也可。

#### 安装Miniconda

**Install Miniconda**

miniconda官网：https://conda.io/miniconda.html

有conda的请跳过`安装Miniconda`段落，更多conda的使用经验请阅读 
- [《Nature Method：Bioconda解决生物软件安装的烦恼》](https://mp.weixin.qq.com/s/SzJswztVB9rHVh3Ak7jpfA)

下载并安装MiniConda2

```
# 下载最新版miniconda2
wget -c https://repo.continuum.io/miniconda/Miniconda2-latest-Linux-x86_64.sh
# 运行安装程序
bash Miniconda2-latest-Linux-x86_64.sh
# 删除安装程序，下次你会下载新版
rm Miniconda2-latest-Linux-x86_64.sh
```

按安装过程中按提示操作：
1. `Please, press ENTER to continue`，按回车键查看许可协议，再按空格键翻页完成全文阅读；
2. `Do you accept the license terms? [yes|no]`，是否同意许可协议，输入`yes`同意许可；
3. 提示默认安装目录为你的家目录下`~/miniconda2`目录，可手动输入一个你指定的安装目录，推荐按回车确认使用此目录；
4. `Do you wish the installer to initialize Miniconda2
by running conda init? [yes|no]`，提示是否默认启动conda环境，这里输入`yes`并回车。

> 注：安装成功，并提示如果想关闭自启动conda base环境，可以使用`conda config --set auto_activate_base false`关闭。

如果你下面运行安装没有权限，请运行 `export PATH="~/miniconda2/bin:$PATH"` 手动添加新安装的miniconda2至环境变量，或尝试`source ~/.bashrc`更新环境变量

> 注：安装结束时提示是否添加至你的环境变量`~/.bashrc`，我选一般选`no`。因为选`yes`可直接将conda环境加入环境变量的最高优先级，使用方便，但conda里的环境如 Python变为默认环境，破坏你之前依赖Python的软件环境。而选no不添加保证之前软件安装环境不变，但运行conda及相关程序时，需要运行一条命令临时添加`~/miniconda2/bin`目录至环境变量，或使用绝对路径执行相关程序 。
> 
> 以后想要使用conda，需要运行如下命令将conda临时添加环境变量
> 
> `export PATH="~/miniconda2/bin:$PATH"`

**但如果是新环境，或要经常使用QIIME 2，推荐使用默认的添加环境变量更方便**。你刚才同意添加环境变量，完成后关闭当前终端，新打开一个终端继续操作才能生效。如果你系统已经有很多程序，添加conda至环境变量可能引起之前软件的依赖关系被破坏。

添加常用软件下载频道，以及国内镜像加速下载。
升级conda为最新版：新版的bug最少，碰到问题的机率也小。

```
# 添加常用下载频道
conda config --add channels defaults
conda config --add channels conda-forge
conda config --add channels bioconda

# 添加清华镜像加速下载
site=https://mirrors.tuna.tsinghua.edu.cn/anaconda
conda config --add channels ${site}/pkgs/free/ 
conda config --add channels ${site}/pkgs/main/
conda config --add channels ${site}/cloud/conda-forge/
conda config --add channels ${site}/pkgs/r/
conda config --add channels ${site}/cloud/bioconda/
conda config --add channels ${site}/cloud/msys2/
conda config --add channels ${site}/cloud/menpo/
conda config --add channels ${site}/cloud/pytorch/

# 升级conda及相关程序
conda update conda

# 安装下载工具
conda install -y wget
```

> 注：软件安装时会提示是否安装时，点`y`，再回车可完成安装。也可像上面代码加-y参数直接确定，无提示。
> conda安装时，有时在Collecting package metadata、和Solving environment等步骤需要等待较长时间，如几分钟至几十分钟，请耐心，一般还是会比手动安装软件要节约更多时间。

关于Conda的安装和使用，教程详见下文：
- [Nature Method：Bioconda解决生物软件安装的烦恼](https://mp.weixin.qq.com/s/SzJswztVB9rHVh3Ak7jpfA)

#### conda环境安装QIIME 2

**Install QIIME 2 within a conda environment**

有macOS和Linux(64-bit)两种系统可选，这里以Linux (64-bit)为例，Mac用记安装代码参阅官网

```
mkdir -p 2020.2 && cd 2020.2
# 下载软件安装列表
wget -c https://data.qiime2.org/distro/core/qiime2-2020.2-py36-linux-conda.yml
# 只有6k，但数据来源于github，有时无法下载，可以从我的github或后台回复“qiime2”获取备份链接
# 创建虚拟环境并安装qiime2，防止影响其它己安装软件
# 我用时33m，供参考，主要由网速决定
time conda env create -n qiime2-2020.2 --file qiime2-2020.2-py36-linux-conda.yml
# 删除软件列表
# rm qiime2-2020.2-py36-linux-conda.yml
```

下载安装所有依赖关系，时间主要由网速决定，我第一次安装1个多小时还中断了。再重试是可以继续末完成的任务，很快就成功了。如果添加有国内的镜像，半小时内可以搞定，详细上文conda配置文章，本次33m搞定。

> 注：如果 https://data.qiime2.org/distro/core/qiime2-2020.2-py36-linux-conda.yml 下载失败，可手动下载此链接，并上传到服务器。或在后台回复“qiime2”获取链接。

#### QIIME 2环境的启动

**Activate the conda environment**

下面我们进入虚拟环境，
如果想不起来你建议的虚拟环境名称，用如下命令查看：

`conda info --envs`

**激活工作环境**，需要几十秒，命令如下：

`conda activate qiime2-2020.2`

#### 测试安装是否成功

Test your installation

**检查是否安装成功**，弹出程序帮助即成功

`qiime --help`

QIIME 2运行成功，显示如下帮助信息：

```
Usage: qiime [OPTIONS] COMMAND [ARGS]...
  QIIME 2 command-line interface (q2cli)
......
Commands:
  info                Display information about current deployment.
......
```

**关闭工作环境**

`conda deactivate`

不用QIIME 2时关闭环境，不然你其它程序可能找不到或运行可能会出错

**软件升级**

How do I update to the newest version of QIIME 2?

QIIME 2虽然经常更新，但每个版本独立，不支持升级。如果有新版本可用，可按照说明安装至另一个新的conda环境中，互不干扰，只是环境名称不同，以版本号区分。

**删除旧版本的QIIME 2**

比如我还有之前安装的QIIME 2 2019.7

删除的方法是：`conda env remove -n qiime2-2019.7`

可以瞬间删除你这么久安装的环境。

### 虚拟机安装

**Installing QIIME 2 using Virtual Machines**

https://docs.qiime2.org/2020.2/install/virtual/

虚拟机安装有三种可选方法，分别为VirtualBox，Amazon云服务，和Docker。目前只推荐上面提的conda方式安装，可以满足绝大多数用户需求。如虚拟机安装仍有需求较多，如留言超过10条，我们将会考虑更新虚拟机安装详细的中文教程。下面有简明教程供参考，不详之处参考原文。

#### 使用VirtualBox方式安装

https://docs.qiime2.org/2020.2/install/virtual/virtualbox/

**此步至少需要 ~25 GB硬盘空间**

Virutalbox是一款强大的虚拟机，可以在Windows / Linux / Mac平台运行，并加载制作好的系统镜像运行。适合Windows配置较高的台式机、笔记本学习QIIME 2使用。

主要步骤：

1. https://www.virtualbox.org 下载你系统对应的virtualbox最新版并安装；以windows为例下载软件 https://download.virtualbox.org/virtualbox/6.1.4/VirtualBox-6.1.4-136177-Win.exe 和扩展包 https://download.virtualbox.org/virtualbox/6.1.4/Oracle_VM_VirtualBox_Extension_Pack-6.1.4.vbox-extpack
2. 下载QIIME2镜像 https://data.qiime2.org/distro/core/2020.2 (目前还提供)，最新只更新为  https://data.qiime2.org/distro/core/2019.10 ，大小5.3GB；
3. 解压下载的QIIME2镜像压缩包；
4. 双击压缩包中的镜像文件`QIIME 2 Core - X.Y.Z (build_number).ovf`，按提示导入镜像。
5. 启动虚拟机，进入基于Ubuntu系统的QIIME 2工作环境；
6. 菜单中安装`Guest Additions`，获取加载目录功能，并设置共享目录用于读取外部数据。

详细图文教程见官方，中文Virutal box使用教程参考 [《扩增子分析QIIME. 1虚拟机安装配置及挂载外部目录》](http://mp.weixin.qq.com/s/WS9u0nhiS1eizL5KXKs__A)

#### 亚马逊云安装

**Installing QIIME 2 using Amazon Web Services**

我没有亚马逊云的测试平台，有需要的用户，详见官方说明：
https://docs.qiime2.org/2020.2/install/virtual/aws/

#### 使用Docker方式安装

**Installing QIIME 2 using Docker**

1. 安装Docker，详见 https://www.docker.com ，Linux可能需要在管理员权限安装和设置用户分组

以Ubuntu系统安装为例（已安装，请跳过）

`sudo apt install docker.io`

添加用户至docker组，请在管理员权限下运行，并**修改为自己的用户名**

    USER=yourname
    sudo usermod -aG docker ${USER}

我比较喜欢使用docker，直接下载预配置好的系统使用，对本地系统无影响

Dokcer的基本操作可参考宏基因组公众号的教程[《扩增子分析流程2.使用Docker运行QIIME》](http://mp.weixin.qq.com/s/jHjLU7CK-RV4iqpb6APwaQ)，和[《Docker的基本使用-Ubuntu18.04》](https://mp.weixin.qq.com/s/GFukUTZNj2Ym4aPh4ZvC7Q)

2. 下载QIIME 2镜像

需要下载3Gb的镜像数据，一般工作时间下载要1小时，下班时间单位不限速，7分钟搞定啦，Docker服务器的速度还是相当可以的(测试时此版本docker还末更新)。

```
time docker pull qiime2/core:2020.2 # real    7m16.499s
```

3. 确定安装是否成功

运行QIIME2 docker

```
docker run -t -i -v $(pwd):/data qiime2/core:2019.7 qiime
# 启动docker命令行，挂载当前目录至虚拟机中/data目录，运行qiime测试

# 方法2. 进入镜像分析数据
docker run --rm -v $(pwd):/data --name=qiime -it  qiime2/core:2019.7
# 这就相当于打开了一个软件工作环境，目录/data为当前工作目录，可方便分析数据
# 可以按Ctrl+D退出当前虚拟机的环境，详见上面docker的使用教程
```

### QIIME 2 2020.2版本核心插件

**QIIME 2 Core 2020.2 distribution**

https://docs.qiime2.org/2020.2/install/#qiime-2-core-2020-2-distribution

QIIME 2 2020.2版本默认安装包括`q2cli`的命令行分析工作环境和如下插件，共21个主要功能模块：

- q2-alignment # 生成和操作多序列比对
- q2-composition # 用于物种数据分析
- q2-cutadapt # 从序列数据中删除接头序列，引物和其他不需要的序列
- q2-dada2 # 序列质量控制
- q2-deblur # 序列质量控制
- q2-demux # 混池测序样本拆分和查看序列质量
- q2-diversity # 探索群落多样性
- q2-emperor # beta多样性3D可视化
- q2-feature-classifier # 物种注释
- q2-feature-table # 按条件操作特征表
- q2-fragment-insertion # 系统发育树扩展，确定准确的进化地位
- q2-gneiss # 构建组合模型
- q2-longitudinal # 成对样本和时间序列分析
- q2-metadata # 处理元数据
- q2-phylogeny # 生成和操纵系统发育树
- q2-quality-control # 用于特征和序列数据质量控制
- q2-quality-filter # 基于PHRED的过滤和修剪
- q2-sample-classifier # 样本元数据的机器学习预测
- q2-taxa # 处理特征物种分类注释
- q2-types # 定义微生物组分析的类型
- q2-vsearch # 聚类和去冗余

插件的功能见上方`qiime --help`弹出的信息

> 注：QIIME 2 Core 2019.7发行版包括由QIIME 2开发团队开发，维护，测试和发布插件和接口。 核心发布是运行QIIME 2教程中的命令所必需的。 如果您想安装其他QIIME 2插件或接口，请参阅相关的软件包文档。 除了Core之外，未来还可以提供其他类型的发行版。


## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年遗传学博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为宏基因组数据分析和植物微生物组，QIIME 2项目参与人。目前在***Science、Nature Biotechnology、Current Opinion in Microbiology***等杂志发表论文二十余篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章500余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(22篇)》](https://mp.weixin.qq.com/s/UFLNaJtFPH-eyd1bLRiPTQ)等，关注人数8万+，累计阅读1200万+。

## Reference

https://docs.qiime2.org/2020.2

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37(8): 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

## 猜你喜欢

- 10000+: [菌群分析](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)  
[宝宝与猫狗](http://mp.weixin.qq.com/s/K3y3an-EaX8iaytmxdzHqA) [提DNA发Nature](http://mp.weixin.qq.com/s/lO5uiMjixJ6aYTjPX-IyaQ) [实验分析谁对结果影响大](http://mp.weixin.qq.com/s/cL_IAoPFfmelKMPMgltrfA)  [Cell微生物专刊](https://mp.weixin.qq.com/s/fN0gpD3bZJDXSp8x4ck-3Q) [肠道指挥大脑](https://mp.weixin.qq.com/s/pZO20VGl3Tf_OtFIbZ-zWw)
- 系列教程：[微生物组入门](http://mp.weixin.qq.com/s/sQyl5EctXFB95Oxg8YIasg) [Biostar](http://mp.weixin.qq.com/s/JL-n2nD6YL8vwuRtTVmQlQ) [微生物组](http://mp.weixin.qq.com/s/li7SdZVaCEyFQF8h6MMh2A)  [宏基因组](http://mp.weixin.qq.com/s/bcyvhFrNr6niqD13rQfZeg) 
- 专业技能：[生信宝典](http://mp.weixin.qq.com/s/2b3_8Vvv7McqCkEfUszW3A) [学术图表](http://mp.weixin.qq.com/s/SCT4oso_vI0UNIJZTaG95g) [高分文章](http://mp.weixin.qq.com/s/kD-x7K4hI5KMgGXikyLt0Q) [不可或缺的人](http://mp.weixin.qq.com/s/1nf7vwyvC3oemkTq_pu87A) 
- 一文读懂：[宏基因组](http://mp.weixin.qq.com/s/Vsm6BJgqsSvxEenIBrGVLw) [寄生虫益处](https://mp.weixin.qq.com/s/hX0K9TOLPnrZ6f8lUoSYag) [进化树](https://mp.weixin.qq.com/s/GV8rU3FZdc8Y-x931k_yrQ)
- 必备技能：[提问](http://mp.weixin.qq.com/s/xCif04bqZB14Z4OvesK0SQ) [搜索](http://mp.weixin.qq.com/s/wn2bqIPgT5UD-GP1qzkJFA)  [Endnote](http://mp.weixin.qq.com/s/SPblPs5ByPdb2C400kIK3w)
- 文献阅读 [热心肠](http://mp.weixin.qq.com/s/1uBeAQ0utxuzTTtfUx_UXA) [SemanticScholar](https://mp.weixin.qq.com/s/gaQiUrRqLpfTXzjyfbua6A) [Geenmedical](https://mp.weixin.qq.com/s/hc8g64aHN7qv8YhVfrsuvQ)
- 扩增子分析：[图表解读](http://mp.weixin.qq.com/s/oiVHO2S1JgYrKXPDU6fH2g) [分析流程](http://mp.weixin.qq.com/s/KrYyy3jjzAL0rQzVfV6h4A) [统计绘图](http://mp.weixin.qq.com/s/6tNePiaDsPPzEBZjiCXIRg) 
- [16S功能预测](http://mp.weixin.qq.com/s/sztbvfdf9wa-3HJXc_m8TQ)   [PICRUSt](https://mp.weixin.qq.com/s/LWtiwBbUCAadMZPaKKDMag)  [FAPROTAX](http://mp.weixin.qq.com/s/J8EwJD_PTDhqRaD7kXlK1A)  [Bugbase](https://mp.weixin.qq.com/s/1WdysPZWo0H6NSYiNpcMUQ) [Tax4Fun](http://mp.weixin.qq.com/s/dzsh44ue93xnAs7gTde7wg)
- 在线工具：[16S预测培养基](http://mp.weixin.qq.com/s/YIrDqNvDX0XMazCGxhH1Lg) [生信绘图](http://mp.weixin.qq.com/s/O0QAQyfxnrXlFLw268B7lg)
- 科研经验：[云笔记](http://mp.weixin.qq.com/s/OnwhWlq3cTycf-W1rxgV7g)  [云协作](http://mp.weixin.qq.com/s/W5By9mZ5PI57_xFfZ_JXiw) [公众号](http://mp.weixin.qq.com/s/hd0sdBDAMqMJsXQs0pIjUg)
- 编程模板: [Shell](http://mp.weixin.qq.com/s/YevGR79NnBAF-xtrqL8gAA)  [R](http://mp.weixin.qq.com/s/OQiE882jM6pVwqTiIjyZ1Q) [Perl](http://mp.weixin.qq.com/s/u2ZmTo-z6cbN-L6KVLYNwg) 
- 生物科普: [肠道细菌](http://mp.weixin.qq.com/s/3T768LA6MWujF4yuzK4MKQ) [人体上的生命](http://mp.weixin.qq.com/s/_DUI6tOYTEq0Wu7K7iRTxw) [生命大跃进](http://mp.weixin.qq.com/s/O_0Il0G_v_aSwkUH_noZVA)  [细胞暗战](http://mp.weixin.qq.com/s/M35ebWAelDIK5Iqib06JzA) [人体奥秘](https://mp.weixin.qq.com/s/xlCdN8il1hcutkYK-42fAQ)  


## 写在后面

为鼓励读者交流、快速解决科研困难，我们建立了“宏基因组”专业讨论群，目前己有国内外5000+ 一线科研人员加入。参与讨论，获得专业解答，欢迎分享此文至朋友圈，并扫码加主编好友带你入群，务必备注“姓名-单位-研究方向-职称/年级”。技术问题寻求帮助，首先阅读[《如何优雅的提问》](http://mp.weixin.qq.com/s/H9gkepap0hy3NNskOkO44w)学习解决问题思路，仍末解决群内讨论，问题不私聊，帮助同行。
![image](http://210.75.224.110/markdown/life/yongxinliu.jpg)

学习扩增子、宏基因组科研思路和分析实战，关注“宏基因组”
![image](http://210.75.224.110/markdown/life/metagenome.jpg)

![image](http://210.75.224.110/markdown/train/1809/201807.jpg)

点击阅读原文，跳转最新文章目录阅读
https://mp.weixin.qq.com/s/5jQspEvH5_4Xmart22gjMA
