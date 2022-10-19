#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

RUN apt-get update && \
    apt-get install -y --no-install-recommends libavcodec58 libavformat58 libavutil56 libswresample3

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Information.csproj", "./"]
RUN dotnet restore "Information.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "Information.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Information.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Information.dll"]